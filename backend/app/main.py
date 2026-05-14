import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import Base, engine
from .routers import anexos, auth, demandas, ilhas, users
from .seed import seed_ilhas

app = FastAPI(title="Sistema de Ilhas", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    os.makedirs(settings.upload_dir, exist_ok=True)
    seed_ilhas()


app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(ilhas.router)
app.include_router(demandas.router)
app.include_router(anexos.router)


@app.get("/")
def root():
    return {"status": "ok", "app": "Sistema de Ilhas"}
