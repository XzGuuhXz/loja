create policy payment_webhook_events_deny_anon on public.payment_webhook_events for all to anon using (false) with check (false);
create policy payment_webhook_events_deny_authenticated on public.payment_webhook_events for all to authenticated using (false) with check (false);
create policy security_rate_limits_deny_anon on public.security_rate_limits for all to anon using (false) with check (false);
create policy security_rate_limits_deny_authenticated on public.security_rate_limits for all to authenticated using (false) with check (false);
