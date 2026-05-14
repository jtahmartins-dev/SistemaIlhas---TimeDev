from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Ilha, User
from ..schemas import UserPublic, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserPublic])
def listar(db: Session = Depends(get_db)):
    return db.scalars(select(User).order_by(User.nome)).all()


@router.patch("/me", response_model=UserPublic)
def atualizar_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.nome is not None:
        user.nome = payload.nome
    if payload.avatar_url is not None:
        user.avatar_url = payload.avatar_url
    if payload.ilha_slug is not None:
        if payload.ilha_slug == "":
            user.ilha_id = None
        else:
            ilha = db.scalar(select(Ilha).where(Ilha.slug == payload.ilha_slug))
            if not ilha:
                raise HTTPException(status_code=400, detail="Ilha inválida.")
            user.ilha_id = ilha.id
    db.commit()
    db.refresh(user)
    return user
