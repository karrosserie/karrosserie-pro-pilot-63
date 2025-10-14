-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow public update client documents with valid token" ON public.clients;
DROP POLICY IF EXISTS "Allow public update vehicle documents with valid token" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public read clients with valid token" ON public.clients;
DROP POLICY IF EXISTS "Allow public read vehicles with valid token" ON public.vehicles;

-- Permettre aux utilisateurs non authentifiés de mettre à jour les documents des clients avec un token valide
CREATE POLICY "Allow public update client documents with valid token"
ON public.clients
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE client_id = clients.id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE client_id = clients.id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
);

-- Permettre aux utilisateurs non authentifiés de mettre à jour les documents des véhicules avec un token valide
CREATE POLICY "Allow public update vehicle documents with valid token"
ON public.vehicles
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE vehicule_id = vehicles.id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE vehicule_id = vehicles.id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
);

-- Permettre aux utilisateurs non authentifiés de lire les clients avec un token valide
CREATE POLICY "Allow public read clients with valid token"
ON public.clients
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE client_id = clients.id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
);

-- Permettre aux utilisateurs non authentifiés de lire les véhicules avec un token valide
CREATE POLICY "Allow public read vehicles with valid token"
ON public.vehicles
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.tokens 
    WHERE vehicule_id = vehicles.id 
    AND created_at > NOW() - INTERVAL '30 days'
  )
);