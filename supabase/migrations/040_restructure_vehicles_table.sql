
-- Migration pour restructurer la table vehicles
-- Supprime les champs brand et model, ajoute model_id avec référence à car_models
-- S'assure que brand_id référence bien car_brands

-- Supprimer les contraintes existantes si elles existent
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_brand_id_fkey;

-- Supprimer les colonnes brand et model
ALTER TABLE vehicles DROP COLUMN IF EXISTS brand;
ALTER TABLE vehicles DROP COLUMN IF EXISTS model;

-- Ajouter la colonne model_id si elle n'existe pas déjà
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model_id UUID;

-- Modifier brand_id pour être de type UUID si ce n'est pas déjà le cas
ALTER TABLE vehicles ALTER COLUMN brand_id TYPE UUID USING brand_id::UUID;

-- Ajouter les contraintes de clés étrangères
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_brand_id_fkey 
FOREIGN KEY (brand_id) REFERENCES car_brands(id) ON DELETE SET NULL;

ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_model_id_fkey 
FOREIGN KEY (model_id) REFERENCES car_models(id) ON DELETE SET NULL;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_model_id ON vehicles(model_id);

-- Mettre à jour la politique RLS pour la table vehicles si nécessaire
DROP POLICY IF EXISTS "Users can manage their own vehicles" ON vehicles;

CREATE POLICY "Users can manage their own vehicles" ON vehicles
    FOR ALL USING (auth.uid() = user_id);
