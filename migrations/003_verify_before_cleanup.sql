-- ============================================
-- VÉRIFICATION 003: S'assurer qu'aucune donnée n'est perdue
-- ============================================
-- Date: 2025-01-XX
-- Description: Script de vérification à exécuter AVANT la suppression des colonnes
--              Ce script ne modifie rien, il affiche seulement les orphelins

-- Vérifier les orphelins (entités avec dossier_id non migrées)
SELECT 'expertise_reports' as table_name, COUNT(*) as orphan_count
FROM expertise_reports er 
WHERE er.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.expertise_report_id = er.id)

UNION ALL

SELECT 'quotes', COUNT(*)
FROM quotes q 
WHERE q.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.quote_id = q.id)

UNION ALL

SELECT 'repair_orders', COUNT(*)
FROM repair_orders ro 
WHERE ro.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.repair_order_id = ro.id)

UNION ALL

SELECT 'fleet_reservations', COUNT(*)
FROM fleet_reservations fr 
WHERE fr.dossier_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.fleet_reservation_id = fr.id);

-- ⚠️ Si orphan_count > 0 pour une table, exécuter le script de création des dossiers manquants:
-- Voir migration 003b_create_missing_dossiers.sql
