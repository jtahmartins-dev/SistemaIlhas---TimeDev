from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Ilha
from ..schemas import IlhaWithMembros

router = APIRouter(prefix="/ilhas", tags=["ilhas"])


@router.get("", response_model=list[IlhaWithMembros])
def listar(db: Session = Depends(get_db)):
    return db.scalars(
        select(Ilha).options(selectinload(Ilha.membros)).order_by(Ilha.ordem)
    ).all()


@router.get("/{slug}", response_model=IlhaWithMembros)
def detalhe(slug: str, db: Session = Depends(get_db)):
    ilha = db.scalar(
        select(Ilha).options(selectinload(Ilha.membros)).where(Ilha.slug == slug)
    )
    if not ilha:
        raise HTTPException(status_code=404, detail="Ilha não encontrada.")
    return ilha
