"""Mini-migrations idempotentes que rodam no startup.

Não é Alembic — é só pra evoluir o schema sem perder dados em deploys já
existentes (ex.: Render Postgres que já tem usuários cadastrados).
"""
from __future__ import annotations

import os

from sqlalchemy import select, text

from .database import SessionLocal, engine
from .models import User


def _coluna_existe(conn, tabela: str, coluna: str) -> bool:
    dialect = engine.dialect.name
    if dialect == "postgresql":
        row = conn.execute(
            text(
                """
                SELECT 1 FROM information_schema.columns
                WHERE table_name = :t AND column_name = :c
                """
            ),
            {"t": tabela, "c": coluna},
        ).first()
        return row is not None
    if dialect == "sqlite":
        rows = conn.execute(text(f"PRAGMA table_info({tabela})")).all()
        return any(r[1] == coluna for r in rows)
    return False


def garantir_coluna_is_admin() -> None:
    """Adiciona users.is_admin se ainda não existir. Funciona em Postgres e SQLite."""
    with engine.begin() as conn:
        if _coluna_existe(conn, "users", "is_admin"):
            return
        dialect = engine.dialect.name
        if dialect == "postgresql":
            conn.execute(
                text(
                    "ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"
                )
            )
        else:
            # SQLite
            conn.execute(
                text(
                    "ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT 0"
                )
            )


def bootstrap_admin_por_email() -> None:
    """Promove a admin o usuário cujo e-mail está em ADMIN_BOOTSTRAP_EMAIL.

    Útil pra criar o primeiro admin sem expor um endpoint público. Setar no Render:
        ADMIN_BOOTSTRAP_EMAIL=seu@email.com
    Reiniciar o serviço — quem tiver esse e-mail vira admin.
    """
    email = (os.environ.get("ADMIN_BOOTSTRAP_EMAIL") or "").strip().lower()
    if not email:
        return
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        if user and not user.is_admin:
            user.is_admin = True
            db.commit()
