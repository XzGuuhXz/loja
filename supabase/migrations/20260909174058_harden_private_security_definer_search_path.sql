create or replace function private.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare current_row record; now_ts timestamptz := clock_timestamp();
begin
  if p_key is null or length(p_key) < 8 or p_limit < 1 or p_window_seconds < 1 then return false; end if;
  select key, window_started_at, hit_count into current_row from public.security_rate_limits where key = p_key for update;
  if not found then
    insert into public.security_rate_limits(key, window_started_at, hit_count, updated_at)
    values (p_key, now_ts, 1, now_ts)
    on conflict (key) do update set hit_count = public.security_rate_limits.hit_count + 1, updated_at = now_ts
    returning key, window_started_at, hit_count into current_row;
    return current_row.hit_count <= p_limit;
  end if;
  if current_row.window_started_at + make_interval(secs => p_window_seconds) <= now_ts then
    update public.security_rate_limits set window_started_at = now_ts, hit_count = 1, updated_at = now_ts where key = p_key; return true;
  end if;
  if current_row.hit_count >= p_limit then update public.security_rate_limits set updated_at = now_ts where key = p_key; return false; end if;
  update public.security_rate_limits set hit_count = hit_count + 1, updated_at = now_ts where key = p_key; return true;
end;
$$;

revoke execute on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
