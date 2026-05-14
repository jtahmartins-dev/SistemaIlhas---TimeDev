import os
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..deps import get_current_user
from ..models import Anexo, Demanda, DemandaEtapa, User
from ..schemas import AnexoOut, LinkAnexoIn

router = APIRouter(prefix="/demandas/{demanda_id}/anexos", tags=["anexos"])

MAX_BYTES = 25 * 1024 * 1024  # 25 MB


def _validar_demanda(db: Session, demanda_id: int) -> Demanda:
    demanda = db.get(Demanda, demanda_id)
    if not demanda:
        raise HTTPException(status_code=404, detail="Demanda não encontrada.")
    return demanda


def _validar_etapa(db: Session, demanda_id: int, etapa_id: int | None) -> int | None:
    if etapa_id is None:
        return None
    etapa = db.get(DemandaEtapa, etapa_id)
    if not etapa or etapa.demanda_id != demanda_id:
        raise HTTPException(status_code=400, detail="Etapa não pertence a essa demanda.")
    return etapa.id


@router.get("", response_model=list[AnexoOut])
def listar(demanda_id: int, db: Session = Depends(get_db)):
    _validar_demanda(db, demanda_id)
    return db.scalars(
        select(Anexo).where(Anexo.demanda_id == demanda_id).order_by(Anexo.enviado_em.desc())
    ).all()


@router.post("/arquivo", response_model=AnexoOut, status_code=201)
async def upload_arquivo(
    demanda_id: int,
    arquivo: UploadFile = File(...),
    etapa_id: int | None = Form(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validar_demanda(db, demanda_id)
    etapa_id_validada = _validar_etapa(db, demanda_id, etapa_id)

    os.makedirs(settings.upload_dir, exist_ok=True)
    ext = os.path.splitext(arquivo.filename or "")[1]
    nome_disco = f"{uuid.uuid4().hex}{ext}"
    destino = os.path.join(settings.upload_dir, nome_disco)

    total = 0
    with open(destino, "wb") as f:
        while chunk := await arquivo.read(1024 * 1024):
            total += len(chunk)
            if total > MAX_BYTES:
                f.close()
                os.remove(destino)
                raise HTTPException(status_code=413, detail="Arquivo excede 25 MB.")
            f.write(chunk)

    anexo = Anexo(
        demanda_id=demanda_id,
        etapa_id=etapa_id_validada,
        tipo="arquivo",
        caminho_ou_url=f"/uploads/{nome_disco}",
        nome_original=arquivo.filename or nome_disco,
        enviado_por_id=user.id,
        enviado_em=datetime.utcnow(),
    )
    db.add(anexo)
    db.commit()
    db.refresh(anexo)
    return anexo


@router.post("/link", response_model=AnexoOut, status_code=201)
def adicionar_link(
    demanda_id: int,
    payload: LinkAnexoIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validar_demanda(db, demanda_id)
    etapa_id_validada = _validar_etapa(db, demanda_id, payload.etapa_id)

    if not payload.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL precisa começar com http:// ou https://")

    anexo = Anexo(
        demanda_id=demanda_id,
        etapa_id=etapa_id_validada,
        tipo="link",
        caminho_ou_url=payload.url,
        nome_original=payload.nome or payload.url,
        enviado_por_id=user.id,
        enviado_em=datetime.utcnow(),
    )
    db.add(anexo)
    db.commit()
    db.refresh(anexo)
    return anexo
