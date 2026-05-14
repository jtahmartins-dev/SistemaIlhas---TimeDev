import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..config import settings
from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import (
    FLUXO_ORDEM,
    ILHA_SLUGS,
    Demanda,
    DemandaEtapa,
    EtapaStatus,
    Role,
    User,
)
from ..schemas import CheckInIn, DemandaCreate, DemandaDetalhe, DemandaResumo

router = APIRouter(prefix="/demandas", tags=["demandas"])


ROLES_POR_ILHA: dict[str, set[Role]] = {
    "bruna": {Role.BRUNA},
    "design": {Role.LIDER_DESIGN, Role.DESIGNER},
    "dev_a": {Role.DEV_EXPERIENTE, Role.DEV_APRENDIZ},
    "dev_b": {Role.DEV_EXPERIENTE, Role.DEV_APRENDIZ},
    "integracao": set(Role),  # todos podem dar check-in na integração
}


def _carregar_demanda(db: Session, demanda_id: int) -> Demanda:
    demanda = db.scalar(
        select(Demanda)
        .options(selectinload(Demanda.etapas), selectinload(Demanda.anexos))
        .where(Demanda.id == demanda_id)
    )
    if not demanda:
        raise HTTPException(status_code=404, detail="Demanda não encontrada.")
    return demanda


def _calcular_status_atual(etapas: list[DemandaEtapa]) -> str:
    por_slug = {e.ilha_slug: e for e in etapas}
    if por_slug["integracao"].status == EtapaStatus.CONCLUIDA:
        return "concluida"
    if por_slug["integracao"].status == EtapaStatus.ATIVA:
        return "integracao"
    if (
        por_slug["dev_a"].status in {EtapaStatus.ATIVA, EtapaStatus.CONCLUIDA}
        or por_slug["dev_b"].status in {EtapaStatus.ATIVA, EtapaStatus.CONCLUIDA}
    ) and por_slug["design"].status == EtapaStatus.CONCLUIDA:
        return "dev"
    if por_slug["design"].status == EtapaStatus.ATIVA:
        return "design"
    return "bruna"


@router.post(
    "",
    response_model=DemandaDetalhe,
    status_code=201,
    dependencies=[Depends(require_roles(Role.BRUNA))],
)
def criar(
    payload: DemandaCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    demanda = Demanda(
        titulo=payload.titulo,
        descricao=payload.descricao,
        criado_por_id=user.id,
        status_atual="bruna",
    )
    db.add(demanda)
    db.flush()

    agora = datetime.utcnow()
    for slug in ILHA_SLUGS:
        etapa = DemandaEtapa(
            demanda_id=demanda.id,
            ilha_slug=slug,
            status=EtapaStatus.ATIVA if slug == "bruna" else EtapaStatus.PENDENTE,
            iniciada_em=agora if slug == "bruna" else None,
        )
        db.add(etapa)

    db.commit()
    db.refresh(demanda)
    return _carregar_demanda(db, demanda.id)


@router.get("", response_model=list[DemandaResumo])
def listar(db: Session = Depends(get_db)):
    return db.scalars(select(Demanda).order_by(Demanda.criado_em.desc())).all()


@router.get("/{demanda_id}", response_model=DemandaDetalhe)
def detalhe(demanda_id: int, db: Session = Depends(get_db)):
    return _carregar_demanda(db, demanda_id)


@router.post("/{demanda_id}/etapas/{slug}/check-in", response_model=DemandaDetalhe)
def check_in(
    demanda_id: int,
    slug: str,
    payload: CheckInIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if slug not in ILHA_SLUGS:
        raise HTTPException(status_code=400, detail="Slug de ilha inválido.")

    permitidos = ROLES_POR_ILHA[slug]
    if not user.is_admin and user.role not in permitidos:
        raise HTTPException(
            status_code=403,
            detail=f"Sua role ({user.role.value}) não pode dar check-in nessa ilha.",
        )

    demanda = _carregar_demanda(db, demanda_id)
    por_slug = {e.ilha_slug: e for e in demanda.etapas}
    etapa = por_slug[slug]

    if etapa.status != EtapaStatus.ATIVA:
        raise HTTPException(
            status_code=409,
            detail=f"Etapa '{slug}' está {etapa.status.value} — só dá check-in em etapa ativa.",
        )

    agora = datetime.utcnow()
    etapa.status = EtapaStatus.CONCLUIDA
    etapa.concluida_em = agora
    if payload.observacoes:
        sufixo = f"\n[{user.nome} @ {agora.isoformat(timespec='minutes')}] {payload.observacoes}"
        etapa.observacoes = (etapa.observacoes or "") + sufixo

    proximos = FLUXO_ORDEM[slug]
    for prox_slug in proximos:
        if prox_slug == "integracao":
            if (
                por_slug["dev_a"].status == EtapaStatus.CONCLUIDA
                and por_slug["dev_b"].status == EtapaStatus.CONCLUIDA
            ):
                if por_slug["integracao"].status == EtapaStatus.PENDENTE:
                    por_slug["integracao"].status = EtapaStatus.ATIVA
                    por_slug["integracao"].iniciada_em = agora
        else:
            if por_slug[prox_slug].status == EtapaStatus.PENDENTE:
                por_slug[prox_slug].status = EtapaStatus.ATIVA
                por_slug[prox_slug].iniciada_em = agora

    demanda.status_atual = _calcular_status_atual(list(por_slug.values()))
    db.commit()
    return _carregar_demanda(db, demanda.id)


@router.delete(
    "/{demanda_id}",
    status_code=204,
    dependencies=[Depends(require_roles(Role.BRUNA))],
)
def deletar(demanda_id: int, db: Session = Depends(get_db)):
    demanda = _carregar_demanda(db, demanda_id)

    for anexo in demanda.anexos:
        if anexo.tipo == "arquivo":
            nome = os.path.basename(anexo.caminho_ou_url)
            caminho = os.path.join(settings.upload_dir, nome)
            if os.path.exists(caminho):
                try:
                    os.remove(caminho)
                except OSError:
                    pass

    db.delete(demanda)
    db.commit()
    return Response(status_code=204)
