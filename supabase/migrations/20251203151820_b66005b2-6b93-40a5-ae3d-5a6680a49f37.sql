-- Ajout des colonnes pour la carte verte d'assurance et le constat sur les véhicules
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_card_url TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS constat_url TEXT;

-- Ajout du consentement pour l'utilisation du nom auprès de l'assurance sur le client
ALTER TABLE clients ADD COLUMN IF NOT EXISTS insurance_representation_consent BOOLEAN DEFAULT NULL;

-- Commentaires pour documentation
COMMENT ON COLUMN vehicles.insurance_card_url IS 'URL de la carte verte d''assurance du véhicule';
COMMENT ON COLUMN vehicles.constat_url IS 'URL du constat amiable d''accident';
COMMENT ON COLUMN clients.insurance_representation_consent IS 'Consentement pour utiliser le nom du client auprès de son assurance';