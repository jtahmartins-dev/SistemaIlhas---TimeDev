from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import EtapaStatus, Role


class IlhaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    nome: str
    descricao: str
    ordem: int


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nome: str
    email: EmailStr
    role: Role
    ilha_id: int | None = None
    avatar_url: str | None = None
    is_admin: bool = False


class UserCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: EmailStr
    senha: str = Field(min_length=6, max_length=100)
    role: Role
    ilha_slug: str | None = None


class UserUpdate(BaseModel):
    nome: str | None = None
    ilha_slug: str | None = None
    avatar_url: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    senha: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class IlhaWithMembros(IlhaOut):
    membros: list[UserPublic] = []


class EtapaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ilha_slug: str
    status: EtapaStatus
    iniciada_em: datetime | None
    concluida_em: datetime | None
    observacoes: str


class AnexoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    etapa_id: int | None
    tipo: Literal["arquivo", "link"]
    caminho_ou_url: str
    nome_original: str
    enviado_por_id: int
    enviado_em: datetime


class DemandaCreate(BaseModel):
    titulo: str = Field(min_length=2, max_length=200)
    descricao: str = ""


class DemandaResumo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    titulo: str
    status_atual: str
    criado_em: datetime
    criado_por_id: int


class DemandaDetalhe(DemandaResumo):
    descricao: str
    etapas: list[EtapaOut]
    anexos: list[AnexoOut]


class CheckInIn(BaseModel):
    observacoes: str = ""


class LinkAnexoIn(BaseModel):
    url: str
    nome: str = ""
    etapa_id: int | None = None
