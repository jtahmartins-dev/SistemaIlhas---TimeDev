# Sistema de Ilhas — Backend (FastAPI)

API que controla o fluxo de demandas entre as ilhas (Bruna → Design → Dev A/B → Integração).

## Como rodar (Windows / PowerShell)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env     # ajuste SECRET_KEY depois
uvicorn app.main:app --reload --port 8000
```

A API sobe em `http://localhost:8000` e a documentação interativa em `http://localhost:8000/docs`.

Na primeira execução o banco SQLite (`sistema_ilhas.db`) é criado automaticamente e as 5 ilhas são inseridas.

## Rotas principais

| Método | Rota | Quem usa |
|-------|------|----------|
| POST  | `/auth/register` | qualquer um (cadastro aberto) |
| POST  | `/auth/login` | qualquer um (form-data: `username`+`password`) |
| GET   | `/auth/me` | logado |
| GET   | `/users` | logado |
| PATCH | `/users/me` | logado (atualiza nome / ilha / avatar) |
| GET   | `/ilhas` | público — retorna ilhas com membros (pro hover) |
| POST  | `/demandas` | só `bruna` |
| GET   | `/demandas` | logado |
| GET   | `/demandas/{id}` | logado |
| POST  | `/demandas/{id}/etapas/{slug}/check-in` | role da ilha |
| POST  | `/demandas/{id}/anexos/arquivo` | logado (multipart) |
| POST  | `/demandas/{id}/anexos/link` | logado |
| GET   | `/demandas/{id}/anexos` | logado |

## Fluxo

1. Bruna cria uma demanda → etapa `bruna` fica **ativa**; demais ficam **pendentes** (só veem resumo).
2. Bruna sobe documentação/arquivo/link e dá check-in em `bruna` → etapa `design` fica ativa.
3. Designers anexam protótipo e dão check-in em `design` → `dev_a` e `dev_b` ativam em paralelo.
4. Cada ilha de dev dá check-in independente. Quando **ambas** terminam, `integracao` ativa.
5. Check-in em `integracao` → demanda fica `concluida`.

## Roles

- `bruna`
- `lider_design`, `designer`
- `dev_experiente`, `dev_aprendiz` (associe à ilha A ou B via `ilha_slug` no cadastro)

## Estrutura

```
app/
  main.py            FastAPI app + CORS + uploads estáticos
  config.py          carrega .env
  database.py        SQLAlchemy engine + sessão
  models.py          User, Ilha, Demanda, DemandaEtapa, Anexo
  schemas.py         Pydantic in/out
  security.py        bcrypt + JWT
  deps.py            current_user, require_roles
  seed.py            popula as 5 ilhas
  routers/           auth, users, ilhas, demandas, anexos
uploads/             arquivos enviados (servido em /uploads)
```
