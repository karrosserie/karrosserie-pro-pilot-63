-- Migration pour supprimer la colonne current_mileage de la table quotes
-- Date: 2025-01-09
-- Description: Suppression du champ "Kilométrage actuel" de la table quotes

BEGIN;

-- Supprimer la colonne current_mileage de la table quotes
ALTER TABLE quotes DROP COLUMN IF EXISTS current_mileage;

COMMIT;