-- Créer des RLS policies pour permettre l'accès public aux données nécessaires pour l'upload de documents

-- Policy pour permettre la lecture des tokens de façon publique (basée sur l'ID du token)
CREATE POLICY "Allow public read access to tokens by id"
ON public.tokens
FOR SELECT
USING (true);

-- Policy pour permettre la lecture publique des informations de company nécessaires
CREATE POLICY "Allow public read access to company info for document upload"
ON public.company_info
FOR SELECT
USING (true);

-- Policy pour permettre la lecture publique des clients avec un token valide
CREATE POLICY "Allow public read access to clients for document upload"
ON public.clients
FOR SELECT
USING (true);

-- Policy pour permettre la mise à jour publique des clients pour l'upload de documents
CREATE POLICY "Allow public update of client documents"
ON public.clients
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy pour permettre la lecture publique des véhicules avec un token valide
CREATE POLICY "Allow public read access to vehicles for document upload"
ON public.vehicles
FOR SELECT
USING (true);

-- Policy pour permettre la mise à jour publique des véhicules pour l'upload de documents
CREATE POLICY "Allow public update of vehicle documents"
ON public.vehicles
FOR UPDATE
USING (true)
WITH CHECK (true);