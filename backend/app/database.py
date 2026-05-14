from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings


def _normalize_db_url(url: str) -> str:
    # Render (e Heroku) entregam "postgres://..." mas SQLAlchemy 2.x quer "postgresql://..."
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    return url


db_url = _normalize_db_url(settings.database_url)
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
engine_kwargs = {"connect_args": connect_args, "echo": False}
if not db_url.startswith("sqlite"):
    # Postgres em free tier costuma derrubar conexões ociosas
    engine_kwargs["pool_pre_ping"] = True

engine = create_engine(db_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
