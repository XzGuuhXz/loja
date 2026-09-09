begin;

select plan(8);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'orders'),
  'orders has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'order_items'),
  'order_items has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'products'),
  'products has RLS enabled'
);

select ok(
  not has_table_privilege('anon', 'public.payment_webhook_events', 'SELECT'),
  'anon cannot read webhook events'
);

select ok(
  not has_table_privilege('authenticated', 'public.payment_webhook_events', 'SELECT'),
  'authenticated cannot read webhook events'
);

select ok(
  not has_table_privilege('anon', 'public.security_rate_limits', 'SELECT'),
  'anon cannot read rate-limit state'
);

select ok(
  not has_table_privilege('authenticated', 'public.security_rate_limits', 'SELECT'),
  'authenticated cannot read rate-limit state'
);

select ok(
  has_function_privilege('service_role', 'public.check_rate_limit(text,integer,integer)', 'EXECUTE'),
  'only server service_role can execute the rate limiter'
);

select * from finish();
rollback;
