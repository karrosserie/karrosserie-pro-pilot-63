-- Ajouter les colonnes pour supporter les cessions de prêt véhicule
ALTER TABLE public.cessions 
  ADD COLUMN IF NOT EXISTS fleet_reservation_id UUID REFERENCES fleet_reservations(id),
  ADD COLUMN IF NOT EXISTS cession_type TEXT DEFAULT 'repair' CHECK (cession_type IN ('repair', 'fleet_loan')),
  ADD COLUMN IF NOT EXISTS loan_amount NUMERIC(10,2);

-- Créer un index pour les recherches par type
CREATE INDEX IF NOT EXISTS idx_cessions_type ON public.cessions(cession_type);

-- Créer un index pour les recherches par fleet_reservation_id
CREATE INDEX IF NOT EXISTS idx_cessions_fleet_reservation ON public.cessions(fleet_reservation_id);