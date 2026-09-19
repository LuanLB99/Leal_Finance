-- Leal Finance - schema inicial
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase (Database > SQL Editor > New query)

-- 1) Categorias
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
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
create index if not exists categories_user_idx on public.categories (user_id);

-- 3) RLS: cada usuário só vê/edita os próprios dados
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id);
drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own" on public.categories for update using (auth.uid() = user_id);
drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id);
drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

-- 4) Ao criar um novo usuário, semear categorias padrão automaticamente
create or replace function public.handle_new_user_categories()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.categories (user_id, name, icon, color, type) values
    (new.id, 'Alimentação', 'utensils', '#f97316', 'expense'),
    (new.id, 'Transporte', 'car', '#3b82f6', 'expense'),
    (new.id, 'Moradia', 'home', '#8b5cf6', 'expense'),
    (new.id, 'Saúde', 'heart-pulse', '#ef4444', 'expense'),
    (new.id, 'Educação', 'graduation-cap', '#06b6d4', 'expense'),
    (new.id, 'Lazer', 'party-popper', '#ec4899', 'expense'),
    (new.id, 'Compras', 'shopping-bag', '#f59e0b', 'expense'),
    (new.id, 'Contas e Assinaturas', 'receipt', '#64748b', 'expense'),
    (new.id, 'Mercado', 'shopping-cart', '#84cc16', 'expense'),
    (new.id, 'Salário', 'wallet', '#22c55e', 'income'),
    (new.id, 'Investimentos', 'trending-up', '#14b8a6', 'income'),
    (new.id, 'Presente', 'gift', '#d946ef', 'both'),
    (new.id, 'Outros', 'circle-ellipsis', '#6b7280', 'both');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_categories on auth.users;
create trigger on_auth_user_created_categories
  after insert on auth.users
  for each row execute function public.handle_new_user_categories();
