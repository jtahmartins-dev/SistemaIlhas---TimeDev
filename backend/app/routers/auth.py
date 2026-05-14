from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Ilha, User
from ..schemas import TokenOut, UserCreate, UserPublic
from ..security import criar_token, hash_senha, verificar_senha

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    ilha_id = None
    if payload.ilha_slug:
        ilha = db.scalar(select(Ilha).where(Ilha.slug == payload.ilha_slug))
        if not ilha:
            raise HTTPException(status_code=400, detail="Ilha inválida.")
        ilha_id = ilha.id

    user = User(
        nome=payload.nome,
        email=payload.email,
        senha_hash=hash_senha(payload.senha),
        role=payload.role,
        ilha_id=ilha_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = criar_token(user.id)
    return TokenOut(access_token=token, user=UserPublic.model_validate(user))


@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == form.username))
    if not user or not verificar_senha(form.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )
    token = criar_token(user.id)
    return TokenOut(access_token=token, user=UserPublic.model_validate(user))


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return user
