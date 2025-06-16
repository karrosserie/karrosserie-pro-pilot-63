
-- Migration pour changer brand et model en brand_id et model_id dans fleet_vehicles

-- Ajouter les nouvelles colonnes avec les références
ALTER TABLE public.fleet_vehicles 
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.car_brands(id),
ADD COLUMN IF NOT EXISTS model_id UUID REFERENCES public.car_models(id);

-- Créer un script temporaire pour migrer les données existantes
-- (cette partie sera exécutée manuellement si des données existent)
-- UPDATE public.fleet_vehicles 
-- SET brand_id = (SELECT id FROM public.car_brands WHERE name = fleet_vehicles.brand LIMIT 1)
-- WHERE brand IS NOT NULL;

-- UPDATE public.fleet_vehicles 
-- SET model_id = (SELECT id FROM public.car_models WHERE name = fleet_vehicles.model LIMIT 1)
-- WHERE model IS NOT NULL;

-- Supprimer les anciennes colonnes texte
ALTER TABLE public.fleet_vehicles 
DROP COLUMN IF EXISTS brand,
DROP COLUMN IF EXISTS model;

-- Ajouter des contraintes NOT NULL après la migration des données
ALTER TABLE public.fleet_vehicles 
ALTER COLUMN brand_id SET NOT NULL,
ALTER COLUMN model_id SET NOT NULL;

-- Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_brand_id ON public.fleet_vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_model_id ON public.fleet_vehicles(model_id);

-- Mettre à jour les commentaires
COMMENT ON COLUMN public.fleet_vehicles.brand_id IS 'Référence vers la marque du véhicule';
COMMENT ON COLUMN public.fleet_vehicles.model_id IS 'Référence vers le modèle du véhicule';
