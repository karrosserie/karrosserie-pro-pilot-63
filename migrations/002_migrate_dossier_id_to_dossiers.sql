-- ============================================
-- MIGRATION 002: Migrer les données *.dossier_id → dossiers.*_id
-- ============================================
-- Date: 2025-01-XX
-- Description: Migration des références bidirectionnelles vers la table dossiers
--              IMPORTANT: Exécuter AVANT de supprimer les colonnes dossier_id

-- 1. expertise_reports.dossier_id → dossiers.expertise_report_id
UPDATE public.dossiers d
SET expertise_report_id = er.id
FROM public.expertise_reports er
WHERE er.dossier_id = d.id
  AND d.expertise_report_id IS NULL;

-- 2. quotes.dossier_id → dossiers.quote_id
UPDATE public.dossiers d
SET quote_id = q.id
FROM public.quotes q
WHERE q.dossier_id = d.id
  AND d.quote_id IS NULL;

-- 3. repair_orders.dossier_id → dossiers.repair_order_id
UPDATE public.dossiers d
SET repair_order_id = ro.id
FROM public.repair_orders ro
WHERE ro.dossier_id = d.id
  AND d.repair_order_id IS NULL;

-- 4. fleet_reservations.dossier_id → dossiers.fleet_reservation_id
UPDATE public.dossiers d
SET fleet_reservation_id = fr.id
FROM public.fleet_reservations fr
WHERE fr.dossier_id = d.id
  AND d.fleet_reservation_id IS NULL;

-- 5. Peupler messageries.dossier_id via client_id matching (1:N - À GARDER)
-- Utilisation d'une sous-requête corrélée compatible PostgreSQL
UPDATE public.messageries m
SET dossier_id = sub.dossier_id
FROM (
  SELECT m2.id as messagerie_id, (
    SELECT d.id 
    FROM dossiers d 
    WHERE d.client_id = m2.client_id 
      AND d.company_id = m2.company_id
      AND d.created_at <= m2.created_at
    ORDER BY d.created_at DESC
    LIMIT 1
  ) as dossier_id
  FROM messageries m2
  WHERE m2.dossier_id IS NULL 
    AND m2.client_id IS NOT NULL
) sub
WHERE m.id = sub.messagerie_id
  AND sub.dossier_id IS NOT NULL;
