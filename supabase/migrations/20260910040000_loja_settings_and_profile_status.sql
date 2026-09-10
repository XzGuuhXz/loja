alter table public.profiles
  add column if not exists status text not null default 'active'
  check (status in ('active','blocked'));

create table if not exists public.store_settings (
  id boolean primary key default true check (id = true),
  store_name text not null default 'Loja',
  logo_url text,
  primary_color text not null default '#10b981',
  secondary_color text not null default '#06b6d4',
  hero_title text not null default 'Escolhas para o dia a dia.',
  hero_subtitle text not null default 'Uma seleção de produtos úteis, bonitos e feitos para acompanhar sua rotina.',
  updated_at timestamptz not null default now()
);
insert into public.store_settings(id) values(true) on conflict(id) do nothing;
alter table public.store_settings enable row level security;
create policy "store_settings_public_read" on public.store_settings for select to anon, authenticated using(true);
create policy "store_settings_admin_all" on public.store_settings for all to authenticated using(private.is_admin()) with check(private.is_admin());
create index if not exists idx_profiles_status on public.profiles(status);