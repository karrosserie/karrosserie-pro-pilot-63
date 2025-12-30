-- ============================================
-- MIGRATION 004: Supprimer les colonnes dossier_id redondantes
-- ============================================
-- Date: 2025-01-XX
-- Description: Suppression des colonnes dossier_id des tables enfants
--              ⚠️ ATTENTION: Exécuter uniquement après vérification (003) et migration (002)
--              ✅ NE PAS SUPPRIMER messageries.dossier_id (relation 1:N directe)

-- 1. Supprimer les contraintes FK sur dossier_id
ALTER TABLE public.expertise_reports DROP CONSTRAINT IF EXISTS expertise_reports_dossier_id_fkey;
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_dossier_id_fkey;
ALTER TABLE public.repair_orders DROP CONSTRAINT IF EXISTS repair_orders_dossier_id_fkey;
ALTER TABLE public.fleet_reservations DROP CONSTRAINT IF EXISTS fleet_reservations_dossier_id_fkey;

-- 2. Supprimer les index sur dossier_id
DROP INDEX IF EXISTS idx_expertise_reports_dossier_id;
DROP INDEX IF EXISTS idx_quotes_dossier_id;
DROP INDEX IF EXISTS idx_repair_orders_dossier_id;
DROP INDEX IF EXISTS idx_fleet_reservations_dossier_id;

-- 3. Supprimer les colonnes dossier_id
ALTER TABLE public.expertise_reports DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.repair_orders DROP COLUMN IF EXISTS dossier_id;
ALTER TABLE public.fleet_reservations DROP COLUMN IF EXISTS dossier_id;

-- ✅ NE PAS SUPPRIMER messageries.dossier_id (relation 1:N directe)
-- La colonne messageries.dossier_id est conservée car :
-- - Un dossier peut avoir PLUSIEURS messageries (relation 1:N)
-- - C'est la seule exception où la FK est dans la table enfant
