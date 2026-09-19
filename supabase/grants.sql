-- Garante que os papeis anon/authenticated conseguem falar com as tabelas
-- (a seguranca de verdade continua sendo as policies de RLS ja criadas em schema.sql)
-- Categorias sao globais e somente-leitura para o app: sem grant de insert/update/delete.
grant usage on schema public to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select, insert, update, delete on public.transactions to anon, authenticated;
