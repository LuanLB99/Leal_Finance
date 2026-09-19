-- Leal Finance - schema inicial
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase (Database > SQL Editor > New query)
-- Categorias sao GLOBAIS do sistema (nao por usuario): só o admin cria/edita/remove, direto por aqui.

-- 1) Categorias (globais, somente leitura para o app)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null default 'circle',
  color text not null default '#6366f1',
  type text not null default 'expense' check (type in ('income', 'expense', 'both')),
  created_at timestamptz not null default now()
);

-- 2) Transações (inclui lançamentos normais e agendados/recorrentes)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  date date not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'scheduled')),
  is_recurring boolean not null default false,
  recurrence_frequency text check (recurrence_frequency in ('weekly', 'monthly', 'yearly')),
  recurrence_end_date date,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions (user_id, date);

-- 3) RLS
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Categorias: qualquer usuário autenticado só LÊ. Sem policy de insert/update/delete
-- de propósito -- com RLS ativo, isso bloqueia escrita para anon/authenticated.
-- Só o admin, pelo SQL Editor (roda como postgres e ignora RLS), gerencia categorias.
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories
  for select using (auth.role() = 'authenticated');

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id);
drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

-- 4) Conjunto padrão de categorias globais
insert into public.categories (name, icon, color, type) values
  ('Alimentação', 'utensils', '#f97316', 'expense'),
  ('Transporte', 'car', '#3b82f6', 'expense'),
  ('Moradia', 'home', '#8b5cf6', 'expense'),
  ('Saúde', 'heart-pulse', '#ef4444', 'expense'),
  ('Educação', 'graduation-cap', '#06b6d4', 'expense'),
  ('Lazer', 'party-popper', '#ec4899', 'expense'),
  ('Compras', 'shopping-bag', '#f59e0b', 'expense'),
  ('Contas e Assinaturas', 'receipt', '#64748b', 'expense'),
  ('Mercado', 'shopping-cart', '#84cc16', 'expense'),
  ('Salário', 'wallet', '#22c55e', 'income'),
  ('Investimentos', 'trending-up', '#14b8a6', 'income'),
  ('Presente', 'gift', '#d946ef', 'both'),
  ('Outros', 'circle-ellipsis', '#6b7280', 'both')
on conflict (name) do nothing;
