
-- Migration pour modifier la table vehicles afin d'utiliser des références aux tables car_brands et car_models

-- Étape 1: Ajouter les nouvelles colonnes avec les foreign keys
ALTER TABLE public.vehicles 
ADD COLUMN brand_id UUID REFERENCES public.car_brands(id),
ADD COLUMN model_id UUID REFERENCES public.car_models(id);

-- Étape 2: Migrer les données existantes en matchant les noms avec les IDs
-- Mise à jour des brand_id
UPDATE public.vehicles 
SET brand_id = cb.id
FROM public.car_brands cb
WHERE vehicles.brand = cb.name;

-- Mise à jour des model_id (en se basant sur le nom du modèle et la marque)
UPDATE public.vehicles 
SET model_id = cm.id
FROM public.car_models cm
JOIN public.car_brands cb ON cm.brand_id = cb.id
WHERE vehicles.model = cm.name AND vehicles.brand = cb.name;

-- Étape 3: Pour les véhicules sans correspondance exacte, les assigner à "Autre"
-- Mise à jour des brand_id manquants vers "Autre"
UPDATE public.vehicles 
SET brand_id = (SELECT id FROM public.car_brands WHERE name = 'Autre')
WHERE brand_id IS NULL;

-- Mise à jour des model_id manquants vers "Autre modèle"
UPDATE public.vehicles 
SET model_id = (SELECT cm.id FROM public.car_models cm JOIN public.car_brands cb ON cm.brand_id = cb.id WHERE cm.name = 'Autre modèle' AND cb.name = 'Autre')
WHERE model_id IS NULL;

-- Étape 4: Rendre les nouvelles colonnes obligatoires
ALTER TABLE public.vehicles 
ALTER COLUMN brand_id SET NOT NULL,
ALTER COLUMN model_id SET NOT NULL;

-- Étape 5: Supprimer les anciennes colonnes brand et model
ALTER TABLE public.vehicles 
DROP COLUMN brand,
DROP COLUMN model;

-- Étape 6: Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_id ON public.vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_model_id ON public.vehicles(model_id);
