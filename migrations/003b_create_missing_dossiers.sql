-- ============================================
-- MIGRATION 003b: Créer les dossiers manquants pour les orphelins
-- ============================================
-- Date: 2025-01-XX
-- Description: Si la vérification 003 montre des orphelins, ce script crée les dossiers manquants
--              Exécuter uniquement si nécessaire après 003_verify_before_cleanup.sql

-- 1. Créer les dossiers depuis les repair_orders orphelins
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  claim_number,
  policy_number,
  incident_date,
  report_number,
  expert_name,
  repair_order_id,
  status,
  overall_status,
  created_at
)
SELECT 
  ro.client_id,
  ro.vehicle_id,
  ro.company_id,
  ro.claim_number,
  ro.policy_number,
  ro.incident_date,
  ro.report_number,
  ro.expert_name,
  ro.id as repair_order_id,
  CASE 
    WHEN ro.status = 'completed' THEN 'terminé'
    WHEN ro.status IN ('cancelled', 'archived') THEN 'archivé'
    ELSE 'en_cours'
  END as status,
  'reparation' as overall_status,
  ro.created_at
FROM public.repair_orders ro
WHERE ro.dossier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.repair_order_id = ro.id)
  AND ro.client_id IS NOT NULL
  AND ro.vehicle_id IS NOT NULL;

-- 2. Créer les dossiers depuis les quotes orphelins
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  claim_number,
  policy_number,
  incident_date,
  report_number,
  expert_name,
  quote_id,
  status,
  overall_status,
  created_at
)
SELECT 
  q.client_id,
  q.vehicle_id,
  q.company_id,
  q.claim_number,
  q.policy_number,
  q.incident_date,
  q.report_number,
  q.expert_name,
  q.id as quote_id,
  'en_cours' as status,
  'devis' as overall_status,
  q.created_at
FROM public.quotes q
WHERE q.dossier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.quote_id = q.id)
  AND q.client_id IS NOT NULL
  AND q.vehicle_id IS NOT NULL;

-- 3. Créer les dossiers depuis les expertise_reports orphelins
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  claim_number,
  policy_number,
  incident_date,
  report_number,
  expert_name,
  expertise_report_id,
  status,
  overall_status,
  created_at
)
SELECT 
  er.client_id,
  er.vehicle_id,
  er.company_id,
  er.claim_number,
  er.policy_number,
  er.incident_date,
  er.report_number,
  er.expert_name,
  er.id as expertise_report_id,
  'en_cours' as status,
  'expertise' as overall_status,
  er.created_at
FROM public.expertise_reports er
WHERE er.dossier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.expertise_report_id = er.id)
  AND er.client_id IS NOT NULL
  AND er.vehicle_id IS NOT NULL;

-- 4. Créer les dossiers depuis les fleet_reservations orphelins
INSERT INTO public.dossiers (
  client_id,
  vehicle_id,
  company_id,
  fleet_reservation_id,
  status,
  overall_status,
  created_at
)
SELECT 
  fr.client_id,
  fr.vehicle_id,
  fr.company_id,
  fr.id as fleet_reservation_id,
  'en_cours' as status,
  'en_cours' as overall_status,
  fr.created_at
FROM public.fleet_reservations fr
WHERE fr.dossier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dossiers d WHERE d.fleet_reservation_id = fr.id)
  AND fr.client_id IS NOT NULL
  AND fr.vehicle_id IS NOT NULL;
