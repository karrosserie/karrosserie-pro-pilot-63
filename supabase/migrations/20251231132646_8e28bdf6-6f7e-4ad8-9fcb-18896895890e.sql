-- Corriger la fonction link_fleet_reservation_to_dossier
-- Le problème: NEW.vehicle_id n'existe pas dans fleet_reservations
-- Solution: utiliser quote_id pour lier au dossier

CREATE OR REPLACE FUNCTION public.link_fleet_reservation_to_dossier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Lier la réservation au dossier via le quote_id si présent
  IF NEW.client_id IS NOT NULL AND NEW.quote_id IS NOT NULL THEN
    UPDATE dossiers 
    SET fleet_reservation_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND quote_id = NEW.quote_id
      AND fleet_reservation_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$;