# Deploy

Fluxo recomendado: **backend no Render + frontend no Vercel + Postgres no Render**. Tudo no plano gratuito.

---

## Passo 0 — Desabilita o GitHub Pages

Como o GitHub Pages não consegue rodar Next.js dinâmico nem o backend Python, desliga ele primeiro pra não confundir:

1. Vá em `https://github.com/jtahmartins-dev/SistemaIlhas---TimeDev/settings/pages`
2. Em **Source**, mude pra **None** e salve.

---

## Passo 1 — Backend + Postgres no Render

1. Cria conta em **<https://render.com>** usando "Log in with GitHub".
2. Autoriza a Render a ver seus repos.
3. No dashboard, clica em **"New +"** → **"Blueprint"**.
4. Seleciona o repo `SistemaIlhas---TimeDev`.
5. A Render detecta o `render.yaml` automaticamente. Confirma e clica em **"Apply"**.
6. Vai criar 2 coisas:
   - `sistema-ilhas-db` (Postgres)
   - `sistema-ilhas-api` (Web Service em Python)
7. Aguarda o primeiro deploy (~3-5 min). Acompanha em **Logs**.
8. Quando terminar, copia a URL do serviço — algo tipo:
   ```
   https://sistema-ilhas-api.onrender.com
   ```
9. Abre essa URL + `/docs` no navegador. Tem que carregar o Swagger (e o JSON `{"status":"ok"...}` na raiz).

> **Importante**: no plano free, o serviço **dorme após 15 min sem requests**. A primeira chamada depois de dormir leva ~30–60s pra acordar. Isso é normal.

---

## Passo 2 — Frontend no Vercel

1. Cria conta em **<https://vercel.com>** com GitHub.
2. Clica em **"Add New..."** → **"Project"**.
3. Importa o repo `SistemaIlhas---TimeDev`.
4. Na tela de configuração:
   - **Framework Preset**: Next.js (auto-detecta)
   - **Root Directory**: clica em **"Edit"** e escolhe `frontend`
   - **Build Command** e **Output Directory**: deixa o padrão
5. Expande **"Environment Variables"** e adiciona:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | a URL do Render do passo 1 (ex: `https://sistema-ilhas-api.onrender.com`) |
6. Clica em **"Deploy"**. Build leva ~2 min.
7. Pega a URL gerada — algo tipo:
   ```
   https://sistema-ilhas-time-dev.vercel.app
   ```

---

## Passo 3 — Libera o CORS

O frontend agora tá num domínio (`*.vercel.app`) diferente do backend (`*.onrender.com`). Precisa autorizar:

1. Volta no Render → seu serviço `sistema-ilhas-api` → **"Environment"** (menu da esquerda).
2. Encontra a variável `CORS_ORIGINS` e clica em **"Edit"**.
3. Cola a URL do Vercel **sem barra no final**:
   ```
   https://sistema-ilhas-time-dev.vercel.app
   ```
   (Se quiser permitir vários domínios depois, separa por vírgula: `https://url1.com,https://url2.com`)
4. **"Save Changes"** → o backend reinicia sozinho.

---

## Passo 4 — Virar admin (opcional, mas útil)

Admins ficam visíveis em **todas as ilhas**, podem **criar/apagar demandas** e dar **check-in em qualquer etapa** (mesmo sem ser daquela role). Pensado pra você (dev / dono do projeto) supervisionar tudo.

Pra promover você mesmo a admin:

1. Garanta que **você já se cadastrou** no site (com o e-mail que você quer usar).
2. No Render → serviço `sistema-ilhas-api` → **Environment**:
   - Clica em **Add Environment Variable**
   - **Key**: `ADMIN_BOOTSTRAP_EMAIL`
   - **Value**: seu e-mail (o mesmo do cadastro). Ex: `joao.h.martins8@aluno.senai.br`
3. **Save Changes** → o backend reinicia (~30s) e te promove a admin no startup.
4. **Faça logout e login de novo** no site pra atualizar o token com a flag `is_admin`.

Depois disso você vai aparecer em todas as ilhas (com a pillzinha "★ admin" do lado do nome), o formulário "Nova demanda" fica liberado e o botão de apagar (×) aparece em cada chip.

Pra promover **outros usuários** depois (sem precisar mexer em env var), use o endpoint:
```
POST /users/{user_id}/promote
POST /users/{user_id}/demote
```
Só admins podem chamar. Dá pra testar pelo Swagger em `/docs`.

---

## Pronto

Acessa a URL do Vercel, cadastra os usuários, cria as demandas — tudo funcionando online.

Daqui pra frente, todo `git push` no `main`:
- Vercel rebuilda o frontend
- Render rebuilda o backend

---

## Limitações do plano grátis (pra saber)

| Coisa | Detalhe |
|---|---|
| **Backend dorme** | Free Render hiberna após 15 min sem requests. Primeira chamada acorda em ~30-60s. |
| **Banco expira** | Postgres free do Render expira em **90 dias**. Antes disso, dá pra fazer backup e recriar. |
| **Uploads não persistem** | O disco do Render free é efêmero — arquivos enviados somem em cada deploy/restart. Pra resolver: integrar com S3/R2 (fora do escopo agora). Links continuam funcionando normal. |
| **Vercel quota** | 100 GB de banda/mês no Hobby — mais que suficiente. |

---

## Troubleshooting

- **Vercel build falha com erro de tipo** → confira que rodou `npm run build` localmente antes; ajuste o erro e dá push.
- **"Failed to fetch" no front depois do deploy** → CORS provavelmente errado. Cheque o `CORS_ORIGINS` no Render, sem barra no final.
- **Backend retorna 500** → vai no Render → Logs do serviço. Geralmente é DATABASE_URL não setada (o blueprint cuida disso, mas se mudou algo, confere).
- **Login funcionava local e não funciona no deploy** → limpa o `localStorage` do navegador. O token antigo foi assinado com outra SECRET_KEY.
