# Sistema de Ilhas — Frontend (Next.js)

Interface visual com ilhas flutuantes + glassmorphism. Consome o back-end FastAPI.

## Rodar (Windows / PowerShell)

```powershell
cd frontend
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Abre em `http://localhost:3000`. O back precisa estar rodando em `http://localhost:8000` (ou ajuste `NEXT_PUBLIC_API_URL`).

## O que tem

- `/login` e `/register` — cadastro aberto, com role e ilha.
- `/dashboard` — visão principal:
  - **Topbar** com usuário + sair
  - Se a role for `bruna`, formulário pra criar nova demanda
  - **Lista de demandas** como chips (clique pra "iluminar" o fluxo)
  - **Arquipélago**: 5 ilhas flutuando, organizadas em 4 colunas (Dev A e B empilhadas)
  - **Hover** numa ilha → cartão com quem está atribuído
  - **Clique** → modal glassmorphism com detalhes, anexos da etapa, upload de arquivo/link, e check-in (se a role bater com a ilha)

## Regras visuais

- Ilha **bloqueada** (etapa pendente da demanda selecionada): translúcida, sem animação.
- Ilha **ativa**: contorno azul.
- Ilha **concluída**: tom esverdeado.
- Sem demanda selecionada: ilhas mostram só os membros (estado neutro).

## Arquitetura

```
app/
  layout.tsx            AuthProvider + globals.css
  page.tsx              redireciona pra /login ou /dashboard
  login/page.tsx
  register/page.tsx
  dashboard/page.tsx    visão principal
  globals.css           céu, glassmorphism, animação de flutuação
components/
  Topbar.tsx
  Island.tsx            cartão flutuante + hover com membros
  IslandModal.tsx       modal glass com anexos + check-in
lib/
  api.ts                client com JWT
  auth.tsx              AuthProvider + useAuth
  types.ts              tipos espelhando o back
```
