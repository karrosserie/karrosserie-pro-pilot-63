
-- Update vehicle status values to match new requirements
-- First, update existing vehicles to use new status values
UPDATE vehicles 
SET status = CASE 
  WHEN status = 'En réparation' THEN 'En cours'
  WHEN status = 'Diagnostic' THEN 'En attente'
  ELSE status
END;

-- Drop the existing constraint
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;

-- Add new constraint with updated status values
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_status_check 
CHECK (status IN ('En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé'));
