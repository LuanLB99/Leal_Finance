-- Leal Finance - migra categorias de "por usuário" para "globais do sistema"
-- Rode isso no SQL Editor do Supabase (depois de schema.sql + grants.sql já terem rodado).
-- Depois desta migração, só o admin (você, direto pelo SQL Editor) cria/edita/remove categorias.
-- O app passa a apenas LER a lista de categorias.

-- 1) Remove o trigger e a função que semeavam categorias por usuário (não fazem mais sentido)
drop trigger if exists on_auth_user_created_categories on auth.users;
drop function if exists public.handle_new_user_categories();

-- 2) Remove as policies antigas ANTES de mexer na coluna user_id (elas dependem dela)
drop policy if exists "categories_select_own" on public.categories;
drop policy if exists "categories_insert_own" on public.categories;
drop policy if exists "categories_update_own" on public.categories;
drop policy if exists "categories_delete_own" on public.categories;

-- 3) Limpa categorias antigas (criadas por usuário/teste) e a coluna de dono
truncate table public.categories restart identity cascade;
alter table public.categories drop column if exists user_id;
alter table public.categories drop constraint if exists categories_name_key;
alter table public.categories add constraint categories_name_key unique (name);

-- 4) Insere o conjunto único e global de categorias
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
  ('Outros', 'circle-ellipsis', '#6b7280', 'both');

-- 5) Reforça: revoga os grants de escrita que a versão anterior deu por usuário
revoke insert, update, delete on public.categories from anon, authenticated;

-- 6) RLS: qualquer usuário autenticado pode LER; ninguém além do admin (via SQL Editor,
-- que roda como postgres e ignora RLS) pode inserir/editar/excluir.
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories
  for select using (auth.role() = 'authenticated');

-- Nenhuma policy de insert/update/delete é criada de propósito:
-- com RLS ativo e sem policy para essas ações, anon/authenticated nunca conseguem escrever.

-- 7) Para adicionar/editar/remover uma categoria no futuro, use o SQL Editor, por exemplo:
-- insert into public.categories (name, icon, color, type) values ('Pets', 'dog', '#a855f7', 'expense');
-- update public.categories set icon = 'plane' where name = 'Lazer';
-- delete from public.categories where name = 'Outros';
