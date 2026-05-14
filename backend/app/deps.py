from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from .database import get_db
from .models import Role, User
from .security import decodificar_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decodificar_token(token)
        user_id = int(payload.get("sub"))
    except (PyJWTError, ValueError, TypeError):
        raise cred_exc
    user = db.get(User, user_id)
    if not user:
        raise cred_exc
    return user


def require_roles(*roles: Role):
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.is_admin:
            return user
        if user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Apenas {', '.join(r.value for r in roles)} (ou admin) podem fazer isso.",
            )
        return user

    return checker


def require_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Apenas admins podem fazer isso.")
    return user
