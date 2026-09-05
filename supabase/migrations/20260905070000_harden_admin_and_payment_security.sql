create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

alter policy categories_admin_delete on public.categories using (private.is_admin());
alter policy categories_admin_insert on public.categories with check (private.is_admin());
alter policy categories_admin_update on public.categories using (private.is_admin()) with check (private.is_admin());
alter policy order_items_own on public.order_items using (exists (select 1 from public.orders o where o.id = order_items.order_id and ((o.user_id = (select auth.uid())) or private.is_admin())));
alter policy orders_admin_update on public.orders using (private.is_admin()) with check (private.is_admin());
alter policy orders_own on public.orders using ((user_id = (select auth.uid())) or private.is_admin());
alter policy product_images_admin_delete on public.product_images using (private.is_admin());
alter policy product_images_admin_insert on public.product_images with check (private.is_admin());
alter policy product_images_admin_update on public.product_images using (private.is_admin()) with check (private.is_admin());
alter policy product_images_public_read on public.product_images using (exists (select 1 from public.products p where p.id = product_images.product_id and ((p.active = true) or private.is_admin())));
alter policy products_admin_delete on public.products using (private.is_admin());
alter policy products_admin_insert on public.products with check (private.is_admin());
alter policy products_admin_update on public.products using (private.is_admin()) with check (private.is_admin());
alter policy products_public_read on public.products using ((active = true) or private.is_admin());
alter policy profiles_select_own on public.profiles using ((id = (select auth.uid())) or private.is_admin());
alter policy "Admins can update product images" on storage.objects using ((bucket_id = 'product-images') and private.is_admin()) with check ((bucket_id = 'product-images') and private.is_admin());
alter policy product_images_admin_delete on storage.objects using ((bucket_id = 'product-images') and private.is_admin());
alter policy product_images_admin_insert on storage.objects with check ((bucket_id = 'product-images') and private.is_admin());
alter policy product_images_admin_update on storage.objects using ((bucket_id = 'product-images') and private.is_admin()) with check ((bucket_id = 'product-images') and private.is_admin());

drop function if exists public.is_admin();
drop function if exists public.set_payment_preference(uuid, text);
