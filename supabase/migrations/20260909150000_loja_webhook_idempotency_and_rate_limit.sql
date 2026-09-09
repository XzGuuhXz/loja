create table if not exists public.payment_webhook_events (
  event_key text primary key,
  payment_id text,
  event_type text not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payment_webhook_events enable row level security;
revoke all on table public.payment_webhook_events from anon, authenticated;
grant all on table public.payment_webhook_events to service_role;

create index if not exists payment_webhook_events_payment_id_idx
  on public.payment_webhook_events (payment_id);

create table if not exists public.security_rate_limits (
  key text primary key,
  window_started_at timestamptz not null,
  hit_count integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.security_rate_limits enable row level security;
revoke all on table public.security_rate_limits from anon, authenticated;
grant all on table public.security_rate_limits to service_role;

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.security_rate_limits%rowtype;
  now_ts timestamptz := clock_timestamp();
begin
  if p_key is null or length(p_key) < 8 or p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  select * into current_row
  from public.security_rate_limits
  where key = p_key
  for update;

  if not found then
    insert into public.security_rate_limits(key, window_started_at, hit_count, updated_at)
    values (p_key, now_ts, 1, now_ts)
    on conflict (key) do nothing;
    return true;
  end if;

  if current_row.window_started_at + make_interval(secs => p_window_seconds) <= now_ts then
    update public.security_rate_limits
    set window_started_at = now_ts, hit_count = 1, updated_at = now_ts
    where key = p_key;
    return true;
  end if;

  if current_row.hit_count >= p_limit then
    update public.security_rate_limits set updated_at = now_ts where key = p_key;
    return false;
  end if;

  update public.security_rate_limits
  set hit_count = hit_count + 1, updated_at = now_ts
  where key = p_key;
  return true;
end;
$$;

revoke execute on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
