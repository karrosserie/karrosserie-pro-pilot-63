-- ============================================
-- MIGRATION: Complete Auto-Link Triggers for Dossiers
-- ============================================
-- Auto-links entities to dossiers based on client_id + vehicle_id

-- 1. Auto-link expertise_reports to dossiers
CREATE OR REPLACE FUNCTION public.link_expertise_report_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
    UPDATE dossiers 
    SET expertise_report_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND vehicle_id = NEW.vehicle_id
      AND expertise_report_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_expertise_report_insert ON expertise_reports;
CREATE TRIGGER after_expertise_report_insert
AFTER INSERT ON expertise_reports
FOR EACH ROW EXECUTE FUNCTION public.link_expertise_report_to_dossier();


-- 2. Auto-link cessions to dossiers (via repair_order to get client/vehicle)
CREATE OR REPLACE FUNCTION public.link_cession_to_dossier()
RETURNS TRIGGER AS $$
DECLARE
  v_client_id UUID;
  v_vehicle_id UUID;
BEGIN
  -- Get client_id and vehicle_id from the linked repair_order
  IF NEW.repair_order_id IS NOT NULL THEN
    SELECT client_id, vehicle_id INTO v_client_id, v_vehicle_id
    FROM repair_orders WHERE id = NEW.repair_order_id;
    
    IF v_client_id IS NOT NULL AND v_vehicle_id IS NOT NULL THEN
      UPDATE dossiers 
      SET cession_id = NEW.id, updated_at = now()
      WHERE client_id = v_client_id 
        AND vehicle_id = v_vehicle_id
        AND cession_id IS NULL
        AND company_id = NEW.company_id
        AND archived = false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_cession_insert ON cessions;
CREATE TRIGGER after_cession_insert
AFTER INSERT ON cessions
FOR EACH ROW EXECUTE FUNCTION public.link_cession_to_dossier();


-- 3. Auto-link fleet_reservations to dossiers
CREATE OR REPLACE FUNCTION public.link_fleet_reservation_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
    UPDATE dossiers 
    SET fleet_reservation_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND vehicle_id = NEW.vehicle_id
      AND fleet_reservation_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_fleet_reservation_insert ON fleet_reservations;
CREATE TRIGGER after_fleet_reservation_insert
AFTER INSERT ON fleet_reservations
FOR EACH ROW EXECUTE FUNCTION public.link_fleet_reservation_to_dossier();


-- 4. Improved messagerie linking (with vehicle_id priority)
CREATE OR REPLACE FUNCTION public.link_messagerie_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.dossier_id IS NULL AND NEW.client_id IS NOT NULL THEN
    -- Priority 1: Match by client_id + vehicle_id if available
    IF NEW.vehicle_id IS NOT NULL THEN
      SELECT id INTO NEW.dossier_id
      FROM dossiers
      WHERE client_id = NEW.client_id
        AND vehicle_id = NEW.vehicle_id
        AND company_id = NEW.company_id
        AND archived = false
      ORDER BY created_at DESC
      LIMIT 1;
    END IF;
    
    -- Priority 2: Fall back to client_id only
    IF NEW.dossier_id IS NULL THEN
      SELECT id INTO NEW.dossier_id
      FROM dossiers
      WHERE client_id = NEW.client_id
        AND company_id = NEW.company_id
        AND archived = false
      ORDER BY created_at DESC
      LIMIT 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS before_messagerie_insert ON messageries;
CREATE TRIGGER before_messagerie_insert
BEFORE INSERT ON messageries
FOR EACH ROW EXECUTE FUNCTION public.link_messagerie_to_dossier();