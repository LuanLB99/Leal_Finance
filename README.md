# Leal Finance

Controle de gastos e receitas pessoal — semanal, mensal e anual — com categorias personalizáveis (ícone + cor) e agendamento de lançamentos futuros/recorrentes.

Stack: React + Vite + TypeScript, [Supabase](https://supabase.com) (Postgres + Auth), deploy no Vercel.

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com as chaves do seu projeto Supabase
npm run dev
```

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings > API**, copie a `Project URL` e a `anon public key` para o seu `.env`.
3. Em **Authentication > Providers**, habilite **Email** (já vem ativo) e **Google** (informe Client ID/Secret do Google Cloud OAuth).
4. Em **Authentication > URL Configuration**, adicione a URL do seu app (local e a de produção no Vercel) em *Redirect URLs*.
5. Abra **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) — isso cria as tabelas `categories`/`transactions`, as políticas de RLS e o trigger que semeia categorias padrão para cada novo usuário.

## Deploy no Vercel

1. Importe este repositório no Vercel.
2. Defina as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no projeto Vercel.
3. Build command: `npm run build` — Output: `dist` (detectado automaticamente pelo preset Vite).
