-- Ajouter support des clients Entreprise
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS client_type TEXT DEFAULT 'particulier' CHECK (client_type IN ('particulier', 'entreprise')),
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS manager_id_url TEXT,
ADD COLUMN IF NOT EXISTS kbis_url TEXT;

-- Ajouter commentaires pour documentation
COMMENT ON COLUMN clients.client_type IS 'Type de client: particulier ou entreprise';
COMMENT ON COLUMN clients.company_name IS 'Raison sociale pour les entreprises';
COMMENT ON COLUMN clients.manager_id_url IS 'URL de la CNI du gérant pour les entreprises';
COMMENT ON COLUMN clients.kbis_url IS 'URL du Kbis pour les entreprises';