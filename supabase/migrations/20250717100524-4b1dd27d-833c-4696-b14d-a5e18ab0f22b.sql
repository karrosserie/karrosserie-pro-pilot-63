-- Supprimer les anciennes politiques de storage
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

-- Créer de nouvelles politiques RLS plus permissives pour le bucket documents
CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.role() = 'authenticated'
);