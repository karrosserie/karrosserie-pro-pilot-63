-- Supprimer toutes les politiques RLS restrictives sur le bucket documents
DROP POLICY IF EXISTS "Allow public upload with valid token" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read for documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete documents" ON storage.objects;

-- Créer des politiques permissives pour permettre tous les accès publics
CREATE POLICY "Allow public access to documents"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');