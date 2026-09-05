-- Avoid broad ALL policies causing an extra SELECT policy evaluation.
drop policy if exists categories_admin_write on public.categories;
drop policy if exists products_admin_write on public.products;
drop policy if exists product_images_admin_write on public.product_images;

create policy categories_admin_insert on public.categories
  for insert to authenticated with check (is_admin());
create policy categories_admin_update on public.categories
  for update to authenticated using (is_admin()) with check (is_admin());
create policy categories_admin_delete on public.categories
  for delete to authenticated using (is_admin());

create policy products_admin_insert on public.products
  for insert to authenticated with check (is_admin());
create policy products_admin_update on public.products
  for update to authenticated using (is_admin()) with check (is_admin());
create policy products_admin_delete on public.products
  for delete to authenticated using (is_admin());

create policy product_images_admin_insert on public.product_images
  for insert to authenticated with check (is_admin());
create policy product_images_admin_update on public.product_images
  for update to authenticated using (is_admin()) with check (is_admin());
create policy product_images_admin_delete on public.product_images
  for delete to authenticated using (is_admin());
