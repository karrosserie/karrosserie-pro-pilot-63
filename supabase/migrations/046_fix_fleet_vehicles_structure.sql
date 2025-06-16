
-- Migration pour corriger la structure de la table fleet_vehicles
-- Supprime les colonnes brand et model, ajoute brand_id et model_id avec les bonnes références

-- Étape 1: Ajouter les nouvelles colonnes brand_id et model_id si elles n'existent pas
ALTER TABLE public.fleet_vehicles 
ADD COLUMN IF NOT EXISTS brand_id UUID,
ADD COLUMN IF NOT EXISTS model_id UUID;

-- Étape 2: Migrer les données existantes si les colonnes brand et model existent
-- Cette partie ne s'exécutera que si les colonnes existent
DO $$
BEGIN
    -- Vérifier si la colonne brand existe
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'fleet_vehicles' 
               AND column_name = 'brand' 
               AND table_schema = 'public') THEN
        
        -- Migrer les données de brand vers brand_id
        UPDATE public.fleet_vehicles 
        SET brand_id = (
            SELECT id FROM public.car_brands 
            WHERE name ILIKE fleet_vehicles.brand 
            LIMIT 1
        )
        WHERE brand IS NOT NULL AND brand_id IS NULL;
        
    END IF;
    
    -- Vérifier si la colonne model existe
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'fleet_vehicles' 
               AND column_name = 'model' 
               AND table_schema = 'public') THEN
        
        -- Migrer les données de model vers model_id
        UPDATE public.fleet_vehicles 
        SET model_id = (
            SELECT id FROM public.car_models 
            WHERE name ILIKE fleet_vehicles.model 
            LIMIT 1
        )
        WHERE model IS NOT NULL AND model_id IS NULL;
        
    END IF;
END
$$;

-- Étape 3: Supprimer les anciennes colonnes brand et model si elles existent
ALTER TABLE public.fleet_vehicles 
DROP COLUMN IF EXISTS brand,
DROP COLUMN IF EXISTS model;

-- Étape 4: Ajouter les contraintes de clés étrangères
ALTER TABLE public.fleet_vehicles 
ADD CONSTRAINT fk_fleet_vehicles_brand_id 
FOREIGN KEY (brand_id) REFERENCES public.car_brands(id) ON DELETE SET NULL;

ALTER TABLE public.fleet_vehicles 
ADD CONSTRAINT fk_fleet_vehicles_model_id 
FOREIGN KEY (model_id) REFERENCES public.car_models(id) ON DELETE SET NULL;

-- Étape 5: Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_brand_id ON public.fleet_vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_model_id ON public.fleet_vehicles(model_id);

-- Étape 6: Mettre à jour les commentaires
COMMENT ON COLUMN public.fleet_vehicles.brand_id IS 'Référence vers la marque du véhicule dans car_brands';
COMMENT ON COLUMN public.fleet_vehicles.model_id IS 'Référence vers le modèle du véhicule dans car_models';

-- Étape 7: Mettre à jour les politiques RLS si nécessaire
DROP POLICY IF EXISTS "Users can manage their own fleet vehicles" ON public.fleet_vehicles;

CREATE POLICY "Users can manage their own fleet vehicles" ON public.fleet_vehicles
    FOR ALL USING (auth.uid() = user_id);
