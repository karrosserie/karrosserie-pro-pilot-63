-- Migration pour ajouter les nouveaux champs à la table quotes
-- Date: 2025-01-09
-- Description: Ajout des champs report_number, policy_number, report_date, expert_name et incident_date

BEGIN;

-- Ajouter les nouvelles colonnes à la table quotes
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS report_number TEXT,
ADD COLUMN IF NOT EXISTS policy_number TEXT,
ADD COLUMN IF NOT EXISTS report_date DATE,
ADD COLUMN IF NOT EXISTS expert_name TEXT,
ADD COLUMN IF NOT EXISTS incident_date DATE;

COMMIT;