-- Keep the remote migration history reproducible in source control.
-- This migration was already applied to the linked production project.

drop policy if exists "Admins can delete product images" on storage.objects;

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif']::text[]
where id = 'product-images';
