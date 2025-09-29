-- Mettre à jour les company_info qui n'ont pas de coordonnées GPS
-- en appelant la fonction de géocodage pour les adresses existantes

UPDATE public.company_info 
SET 
  latitude = (test_geocoding(address)->>'latitude')::numeric,
  longitude = (test_geocoding(address)->>'longitude')::numeric,
  updated_at = NOW()
WHERE 
  address IS NOT NULL 
  AND address != '' 
  AND (latitude IS NULL OR longitude IS NULL)
  AND id IN (
    SELECT id FROM public.company_info 
    WHERE address IS NOT NULL 
    AND address != ''
    AND (latitude IS NULL OR longitude IS NULL)
    LIMIT 5  -- Limiter pour éviter de consommer trop de ressources
  );