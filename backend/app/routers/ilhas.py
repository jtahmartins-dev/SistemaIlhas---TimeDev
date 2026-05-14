from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Ilha, User
from ..schemas import IlhaWithMembros, UserPublic

router = APIRouter(prefix="/ilhas", tags=["ilhas"])


def _carregar_admins(db: Session) -> list[User]:
    return list(db.scalars(select(User).where(User.is_admin == True)).all())  # noqa: E712


def _ilha_com_admins(ilha: Ilha, admins: list[User]) -> IlhaWithMembros:
    """Monta a resposta da ilha incluindo admins como membros virtuais.

    Admin já atribuído a essa ilha aparece uma vez só. Admin sem ilha
    fixa aparece em todas as ilhas (é supervisor).
    """
    ids_da_ilha = {m.id for m in ilha.membros}
    membros = [UserPublic.model_validate(m) for m in ilha.membros]
    for adm in admins:
        if adm.id in ids_da_ilha:
            continue
        membros.append(UserPublic.model_validate(adm))
    return IlhaWithMembros(
        id=ilha.id,
        slug=ilha.slug,
        nome=ilha.nome,
        descricao=ilha.descricao,
        ordem=ilha.ordem,
        membros=membros,
    )


@router.get("", response_model=list[IlhaWithMembros])
def listar(db: Session = Depends(get_db)):
    ilhas = db.scalars(
        select(Ilha).options(selectinload(Ilha.membros)).order_by(Ilha.ordem)
    ).all()
    admins = _carregar_admins(db)
    return [_ilha_com_admins(i, admins) for i in ilhas]


@router.get("/{slug}", response_model=IlhaWithMembros)
def detalhe(slug: str, db: Session = Depends(get_db)):
    ilha = db.scalar(
        select(Ilha).options(selectinload(Ilha.membros)).where(Ilha.slug == slug)
    )
    if not ilha:
        raise HTTPException(status_code=404, detail="Ilha não encontrada.")
    admins = _carregar_admins(db)
    return _ilha_com_admins(ilha, admins)
