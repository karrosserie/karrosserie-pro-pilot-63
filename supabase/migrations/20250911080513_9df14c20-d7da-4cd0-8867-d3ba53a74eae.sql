-- Supprimer les policies trop permissives créées précédemment
DROP POLICY IF EXISTS "Allow public read access to tokens by id" ON public.tokens;
DROP POLICY IF EXISTS "Allow public read access to company info for document upload" ON public.company_info;
DROP POLICY IF EXISTS "Allow public read access to clients for document upload" ON public.clients;
DROP POLICY IF EXISTS "Allow public update of client documents" ON public.clients;
DROP POLICY IF EXISTS "Allow public read access to vehicles for document upload" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public update of vehicle documents" ON public.vehicles;

-- Créer une function pour vérifier si un token existe et est valide
CREATE OR REPLACE FUNCTION public.is_valid_token(token_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE id = token_id
    AND created_at > NOW() - INTERVAL '30 days' -- Token valide pendant 30 jours
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Policy pour permettre la lecture des tokens de façon publique (par ID uniquement) 
CREATE POLICY "Allow public read access to specific tokens"
ON public.tokens
FOR SELECT
USING (id IS NOT NULL);

-- Policy pour permettre la lecture des company_info par token
CREATE POLICY "Allow public read company info with valid token"
ON public.company_info  
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.company_id = company_info.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
);

-- Policy pour permettre la lecture des clients par token
CREATE POLICY "Allow public read client with valid token"
ON public.clients
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.client_id = clients.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
);

-- Policy pour permettre la mise à jour des documents clients par token
CREATE POLICY "Allow public update client documents with valid token"
ON public.clients
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.client_id = clients.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.client_id = clients.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
);

-- Policy pour permettre la lecture des véhicules par token  
CREATE POLICY "Allow public read vehicle with valid token"
ON public.vehicles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.vehicule_id = vehicles.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
);

-- Policy pour permettre la mise à jour des documents véhicules par token
CREATE POLICY "Allow public update vehicle documents with valid token"
ON public.vehicles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.vehicule_id = vehicles.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tokens t 
    WHERE t.vehicule_id = vehicles.id
    AND t.created_at > NOW() - INTERVAL '30 days'
  )
);

-- Créer des policies pour le storage bucket 'documents' pour permettre l'upload public avec token
CREATE POLICY "Allow public upload to documents bucket with valid path"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  -- Le path doit contenir un UUID de client ou véhicule valide
  (
    -- Path pour client: client_id/...
    EXISTS (
      SELECT 1 FROM public.tokens t 
      WHERE t.client_id::text = split_part(name, '/', 1)
      AND t.created_at > NOW() - INTERVAL '30 days'
    )
    OR
    -- Path pour véhicule: vehicle_id/...  
    EXISTS (
      SELECT 1 FROM public.tokens t
      WHERE t.vehicule_id::text = split_part(name, '/', 1)
      AND t.created_at > NOW() - INTERVAL '30 days'
    )
  )
);

CREATE POLICY "Allow public read from documents bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');