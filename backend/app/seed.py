from sqlalchemy import select

from .database import SessionLocal
from .models import Ilha

ILHAS_SEED = [
    {
        "slug": "bruna",
        "nome": "Bruna",
        "ordem": 1,
        "descricao": "Dona da demanda. Recebe, separa em partes menores e define como ela quer que fique.",
    },
    {
        "slug": "design",
        "nome": "Ilha Design",
        "ordem": 2,
        "descricao": "Cria layouts, estilos e protótipos. Recebe da Bruna e valida com ela antes de passar pros devs.",
    },
    {
        "slug": "dev_a",
        "nome": "Ilha Dev A",
        "ordem": 3,
        "descricao": "Desenvolve parte da solução (geralmente front-end), validando com design e Bruna.",
    },
    {
        "slug": "dev_b",
        "nome": "Ilha Dev B",
        "ordem": 4,
        "descricao": "Desenvolve outra parte (geralmente back-end): regras, banco, integração.",
    },
    {
        "slug": "integracao",
        "nome": "Integração e Validação",
        "ordem": 5,
        "descricao": "Todos envolvidos juntam as partes, testam o fluxo completo e validam com design e Bruna.",
    },
]


def seed_ilhas() -> None:
    with SessionLocal() as db:
        existentes = {i.slug for i in db.scalars(select(Ilha)).all()}
        novos = 0
        for dados in ILHAS_SEED:
            if dados["slug"] in existentes:
                continue
            db.add(Ilha(**dados))
            novos += 1
        if novos:
            db.commit()


if __name__ == "__main__":
    seed_ilhas()
    print("Ilhas semeadas.")
