-- Migration pour ajouter la colonne expert_mail à la table expertise_reports
-- Date: 2025-01-24
-- Description: Ajout du champ email de l'expert dans les rapports d'expertise

BEGIN;

-- Ajouter la colonne expert_mail
ALTER TABLE expertise_reports 
ADD COLUMN IF NOT EXISTS expert_mail TEXT;

-- Ajouter un commentaire pour documentation
COMMENT ON COLUMN expertise_reports.expert_mail IS 'Email de contact de l''expert ayant rédigé le rapport';

COMMIT;
