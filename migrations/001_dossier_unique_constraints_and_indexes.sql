-- ============================================
-- MIGRATION 001: Contraintes UNIQUE sur dossiers
-- ============================================
-- Date: 2025-01-XX
-- Description: Ajout des contraintes UNIQUE pour garantir les relations 1:1
--              et création des index de performance

-- Note: PostgreSQL ne supporte pas "ADD CONSTRAINT IF NOT EXISTS"
-- On utilise DO blocks pour vérifier l'existence avant création

-- 1. Contraintes UNIQUE pour garantir le 1:1
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_expertise_report_per_dossier'
  ) THEN
    ALTER TABLE public.dossiers 
    ADD CONSTRAINT unique_expertise_report_per_dossier UNIQUE (expertise_report_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_quote_per_dossier'
  ) THEN
    ALTER TABLE public.dossiers 
    ADD CONSTRAINT unique_quote_per_dossier UNIQUE (quote_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_repair_order_per_dossier'
  ) THEN
    ALTER TABLE public.dossiers 
    ADD CONSTRAINT unique_repair_order_per_dossier UNIQUE (repair_order_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_cession_per_dossier'
  ) THEN
    ALTER TABLE public.dossiers 
    ADD CONSTRAINT unique_cession_per_dossier UNIQUE (cession_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_fleet_reservation_per_dossier'
  ) THEN
    ALTER TABLE public.dossiers 
    ADD CONSTRAINT unique_fleet_reservation_per_dossier UNIQUE (fleet_reservation_id);
  END IF;
END $$;

-- 2. Index partiels pour performances (seulement sur les valeurs non-null)
CREATE INDEX IF NOT EXISTS idx_dossiers_expertise_report_id 
ON public.dossiers(expertise_report_id) 
WHERE expertise_report_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dossiers_quote_id 
ON public.dossiers(quote_id) 
WHERE quote_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dossiers_repair_order_id 
ON public.dossiers(repair_order_id) 
WHERE repair_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dossiers_cession_id 
ON public.dossiers(cession_id) 
WHERE cession_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dossiers_fleet_reservation_id 
ON public.dossiers(fleet_reservation_id) 
WHERE fleet_reservation_id IS NOT NULL;

-- 3. Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_dossiers_company_id 
ON public.dossiers(company_id);

CREATE INDEX IF NOT EXISTS idx_dossiers_client_id 
ON public.dossiers(client_id);

CREATE INDEX IF NOT EXISTS idx_dossiers_vehicle_id 
ON public.dossiers(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_dossiers_overall_status 
ON public.dossiers(overall_status);

CREATE INDEX IF NOT EXISTS idx_dossiers_archived 
ON public.dossiers(archived) 
WHERE archived = false;
