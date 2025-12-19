-- Supprimer l'ancienne contrainte
ALTER TABLE cessions DROP CONSTRAINT IF EXISTS cessions_cession_type_check;

-- Ajouter la nouvelle contrainte avec repair_enterprise
ALTER TABLE cessions ADD CONSTRAINT cessions_cession_type_check 
  CHECK (cession_type = ANY (ARRAY['repair'::text, 'repair_enterprise'::text, 'fleet_loan'::text]));