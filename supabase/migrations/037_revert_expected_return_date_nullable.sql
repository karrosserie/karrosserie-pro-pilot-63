
-- Migration pour inverser les changements de la migration 036
-- Cette migration rend la colonne expected_return_date NOT NULL à nouveau dans fleet_reservations

-- Remettre la contrainte NOT NULL sur expected_return_date
ALTER TABLE fleet_reservations 
ALTER COLUMN expected_return_date SET NOT NULL;

-- Mettre à jour le commentaire pour refléter le changement
COMMENT ON COLUMN fleet_reservations.expected_return_date IS 'Date de retour prévue (obligatoire)';
