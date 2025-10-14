-- Politique RLS pour permettre l'upload de documents avec un token valide
-- Les clients non authentifiés peuvent uploader des documents si le path contient un client_id ou vehicule_id avec un token valide

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow public upload with valid token" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;

-- Fonction pour vérifier si un path contient un ID avec un token valide
CREATE OR REPLACE FUNCTION public.check_token_for_upload(file_path text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  extracted_id uuid;
  has_valid_token boolean;
BEGIN
  -- Extraire le premier UUID du path (peut être client_id ou vehicule_id)
  extracted_id := (regexp_matches(file_path, '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'))[1]::uuid;
  
  IF extracted_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Vérifier s'il existe un token valide pour ce client_id ou vehicule_id
  SELECT EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE (client_id = extracted_id OR vehicule_id = extracted_id)
    AND created_at > NOW() - INTERVAL '30 days'
  ) INTO has_valid_token;
  
  RETURN has_valid_token;
END;
$$;

-- Politique pour permettre l'upload avec un token valide (utilisateurs non authentifiés)
CREATE POLICY "Allow public upload with valid token"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'documents' 
  AND public.check_token_for_upload(name)
);

-- Politique pour permettre l'upload aux utilisateurs authentifiés de leur company
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
);

-- Politique pour permettre la lecture publique des documents (pour getPublicUrl)
DROP POLICY IF EXISTS "Allow public read for documents" ON storage.objects;
CREATE POLICY "Allow public read for documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Allow authenticated delete documents" ON storage.objects;
CREATE POLICY "Allow authenticated delete documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents');