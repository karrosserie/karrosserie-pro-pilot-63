
-- Add constraint for vehicle status values
ALTER TABLE vehicles 
DROP CONSTRAINT IF EXISTS vehicles_status_check;

ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_status_check 
CHECK (status IN ('En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé'));

-- Update any existing vehicles with invalid status to 'En attente'
UPDATE vehicles 
SET status = 'En attente' 
WHERE status IS NULL OR status NOT IN ('En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé');
