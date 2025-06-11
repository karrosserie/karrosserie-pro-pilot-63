
-- Migration pour rendre la colonne expected_return_date nullable dans fleet_reservations
-- Cette modification permet aux utilisateurs de ne pas spécifier de date de retour prévue

-- Modifier la contrainte NOT NULL sur expected_return_date
ALTER TABLE fleet_reservations 
ALTER COLUMN expected_return_date DROP NOT NULL;

-- Ajouter un commentaire pour documenter le changement
COMMENT ON COLUMN fleet_reservations.expected_return_date IS 'Date de retour prévue (optionnelle)';
