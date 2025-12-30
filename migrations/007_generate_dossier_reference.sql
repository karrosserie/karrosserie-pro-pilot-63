-- ============================================
-- MIGRATION 007: Génération automatique des références de dossiers
-- ============================================
-- Date: 2025-01-XX
-- Description: Trigger pour générer automatiquement une référence unique pour chaque dossier

CREATE OR REPLACE FUNCTION public.generate_dossier_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'DOS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS before_dossier_generate_reference ON dossiers;
CREATE TRIGGER before_dossier_generate_reference
BEFORE INSERT ON dossiers
FOR EACH ROW EXECUTE FUNCTION public.generate_dossier_reference();
