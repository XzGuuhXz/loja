revoke execute on function public.is_admin() from authenticated;
revoke execute on function public.set_payment_preference(uuid, text) from authenticated;
grant execute on function public.is_admin() to service_role;
grant execute on function public.set_payment_preference(uuid, text) to service_role;
