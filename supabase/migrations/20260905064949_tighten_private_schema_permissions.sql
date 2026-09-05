revoke all on schema private from anon;
revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke all on all tables in schema private from anon, public;
revoke all on all sequences in schema private from anon, public;
revoke all on all functions in schema private from anon, public;
grant execute on function private.is_admin() to authenticated;
