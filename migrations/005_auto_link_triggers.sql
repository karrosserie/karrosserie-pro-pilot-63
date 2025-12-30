-- ============================================
-- MIGRATION 005: Triggers d'auto-liaison (sans bidirectionnel)
-- ============================================
-- Date: 2025-01-XX
-- Description: Triggers pour auto-lier les nouvelles entités aux dossiers
--              via client_id + vehicle_id

-- 1. Trigger pour repair_orders : auto-lier au dossier
CREATE OR REPLACE FUNCTION public.link_repair_order_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  -- Chercher un dossier existant par client_id + vehicle_id
  IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
    UPDATE dossiers 
    SET repair_order_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND vehicle_id = NEW.vehicle_id
      AND repair_order_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_repair_order_insert ON repair_orders;
CREATE TRIGGER after_repair_order_insert
AFTER INSERT ON repair_orders
FOR EACH ROW EXECUTE FUNCTION public.link_repair_order_to_dossier();


-- 2. Trigger pour quotes : auto-lier au dossier
CREATE OR REPLACE FUNCTION public.link_quote_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
    UPDATE dossiers 
    SET quote_id = NEW.id, updated_at = now()
    WHERE client_id = NEW.client_id 
      AND vehicle_id = NEW.vehicle_id
      AND quote_id IS NULL
      AND company_id = NEW.company_id
      AND archived = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_quote_insert ON quotes;
CREATE TRIGGER after_quote_insert
AFTER INSERT ON quotes
FOR EACH ROW EXECUTE FUNCTION public.link_quote_to_dossier();


-- 3. Trigger pour messageries : auto-déduire dossier_id via client_id
CREATE OR REPLACE FUNCTION public.link_messagerie_to_dossier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.dossier_id IS NULL AND NEW.client_id IS NOT NULL THEN
    SELECT id INTO NEW.dossier_id
    FROM dossiers
    WHERE client_id = NEW.client_id
      AND company_id = NEW.company_id
      AND archived = false
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS before_messagerie_insert ON messageries;
CREATE TRIGGER before_messagerie_insert
BEFORE INSERT ON messageries
FOR EACH ROW EXECUTE FUNCTION public.link_messagerie_to_dossier();
