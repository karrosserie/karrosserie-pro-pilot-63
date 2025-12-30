-- ============================================
-- MIGRATION 006: Calcul automatique de overall_status
-- ============================================
-- Date: 2025-01-XX
-- Description: Trigger pour calculer automatiquement le statut global du dossier
--              basé sur les entités liées

CREATE OR REPLACE FUNCTION public.update_dossier_overall_status()
RETURNS TRIGGER AS $$
DECLARE
  v_status TEXT;
BEGIN
  SELECT 
    CASE
      WHEN NEW.repair_order_id IS NOT NULL THEN
        CASE 
          WHEN EXISTS (SELECT 1 FROM invoices WHERE repair_order_id = NEW.repair_order_id AND status = 'paid') THEN 'cloture'
          WHEN EXISTS (SELECT 1 FROM invoices WHERE repair_order_id = NEW.repair_order_id) THEN 'facturation'
          ELSE 'reparation'
        END
      WHEN NEW.quote_id IS NOT NULL THEN 'devis'
      WHEN NEW.expertise_report_id IS NOT NULL THEN 'expertise'
      ELSE 'ouvert'
    END INTO v_status;
  
  NEW.overall_status := v_status;
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS before_dossier_update_status ON dossiers;
CREATE TRIGGER before_dossier_update_status
BEFORE UPDATE ON dossiers
FOR EACH ROW EXECUTE FUNCTION public.update_dossier_overall_status();

-- Trigger également sur INSERT pour initialiser le statut
DROP TRIGGER IF EXISTS before_dossier_insert_status ON dossiers;
CREATE TRIGGER before_dossier_insert_status
BEFORE INSERT ON dossiers
FOR EACH ROW EXECUTE FUNCTION public.update_dossier_overall_status();
