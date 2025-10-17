-- Create suppliers-logos storage bucket
insert into storage.buckets (id, name, public)
values ('suppliers-logos', 'suppliers-logos', true)
on conflict (id) do nothing;

-- Allow public access to view logos
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'suppliers-logos' );

-- Allow authenticated users to upload logos
create policy "Authenticated users can upload supplier logos"
on storage.objects for insert
with check (
  bucket_id = 'suppliers-logos' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploaded logos
create policy "Authenticated users can update supplier logos"
on storage.objects for update
using (
  bucket_id = 'suppliers-logos'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete logos
create policy "Authenticated users can delete supplier logos"
on storage.objects for delete
using (
  bucket_id = 'suppliers-logos'
  AND auth.role() = 'authenticated'
);
