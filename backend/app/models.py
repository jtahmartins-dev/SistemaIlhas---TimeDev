from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Role(str, Enum):
    BRUNA = "bruna"
    LIDER_DESIGN = "lider_design"
    DESIGNER = "designer"
    DEV_EXPERIENTE = "dev_experiente"
    DEV_APRENDIZ = "dev_aprendiz"


class EtapaStatus(str, Enum):
    PENDENTE = "pendente"
    ATIVA = "ativa"
    CONCLUIDA = "concluida"


ILHA_SLUGS = ["bruna", "design", "dev_a", "dev_b", "integracao"]
FLUXO_ORDEM = {
    "bruna": ["design"],
    "design": ["dev_a", "dev_b"],
    "dev_a": ["integracao"],
    "dev_b": ["integracao"],
    "integracao": [],
}


class Ilha(Base):
    __tablename__ = "ilhas"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    nome: Mapped[str] = mapped_column(String(80))
    descricao: Mapped[str] = mapped_column(Text, default="")
    ordem: Mapped[int] = mapped_column(Integer)

    membros: Mapped[list["User"]] = relationship(back_populates="ilha")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(SAEnum(Role))
    ilha_id: Mapped[int | None] = mapped_column(ForeignKey("ilhas.id"), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    ilha: Mapped[Ilha | None] = relationship(back_populates="membros")


class Demanda(Base):
    __tablename__ = "demandas"

    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[str] = mapped_column(String(200))
    descricao: Mapped[str] = mapped_column(Text, default="")
    criado_por_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    status_atual: Mapped[str] = mapped_column(String(20), default="bruna")

    criado_por: Mapped[User] = relationship()
    etapas: Mapped[list["DemandaEtapa"]] = relationship(
        back_populates="demanda", cascade="all, delete-orphan", order_by="DemandaEtapa.id"
    )
    anexos: Mapped[list["Anexo"]] = relationship(
        back_populates="demanda", cascade="all, delete-orphan"
    )


class DemandaEtapa(Base):
    __tablename__ = "demanda_etapas"

    id: Mapped[int] = mapped_column(primary_key=True)
    demanda_id: Mapped[int] = mapped_column(ForeignKey("demandas.id"))
    ilha_slug: Mapped[str] = mapped_column(String(20), index=True)
    status: Mapped[EtapaStatus] = mapped_column(
        SAEnum(EtapaStatus), default=EtapaStatus.PENDENTE
    )
    iniciada_em: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    concluida_em: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    observacoes: Mapped[str] = mapped_column(Text, default="")

    demanda: Mapped[Demanda] = relationship(back_populates="etapas")


class Anexo(Base):
    __tablename__ = "anexos"

    id: Mapped[int] = mapped_column(primary_key=True)
    demanda_id: Mapped[int] = mapped_column(ForeignKey("demandas.id"))
    etapa_id: Mapped[int | None] = mapped_column(
        ForeignKey("demanda_etapas.id"), nullable=True
    )
    tipo: Mapped[str] = mapped_column(String(10))  # 'arquivo' | 'link'
    caminho_ou_url: Mapped[str] = mapped_column(String(500))
    nome_original: Mapped[str] = mapped_column(String(255))
    enviado_por_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    enviado_em: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    demanda: Mapped[Demanda] = relationship(back_populates="anexos")
    enviado_por: Mapped[User] = relationship()
