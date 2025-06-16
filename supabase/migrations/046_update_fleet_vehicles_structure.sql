
-- Migration to update fleet_vehicles table structure
-- Replace brand/model columns with brand_id/model_id references

BEGIN;

-- First, add the new columns
ALTER TABLE fleet_vehicles 
ADD COLUMN IF NOT EXISTS brand_id UUID,
ADD COLUMN IF NOT EXISTS model_id UUID;

-- Create temporary mapping for existing data (if any exists)
-- This assumes we have some basic car brands/models in the system
DO $$
DECLARE
    default_brand_id UUID;
    default_model_id UUID;
BEGIN
    -- Get or create a default brand
    SELECT id INTO default_brand_id FROM car_brands WHERE name = 'Autre' LIMIT 1;
    IF default_brand_id IS NULL THEN
        INSERT INTO car_brands (name) VALUES ('Autre') RETURNING id INTO default_brand_id;
    END IF;
    
    -- Get or create a default model for the default brand
    SELECT id INTO default_model_id FROM car_models WHERE brand_id = default_brand_id AND name = 'Autre' LIMIT 1;
    IF default_model_id IS NULL THEN
        INSERT INTO car_models (brand_id, name) VALUES (default_brand_id, 'Autre') RETURNING id INTO default_model_id;
    END IF;
    
    -- Update existing records to use the default IDs
    UPDATE fleet_vehicles 
    SET brand_id = default_brand_id, 
        model_id = default_model_id 
    WHERE brand_id IS NULL OR model_id IS NULL;
END $$;

-- Now make the columns NOT NULL
ALTER TABLE fleet_vehicles 
ALTER COLUMN brand_id SET NOT NULL,
ALTER COLUMN model_id SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE fleet_vehicles 
ADD CONSTRAINT fk_fleet_vehicles_brand 
FOREIGN KEY (brand_id) REFERENCES car_brands(id) ON DELETE RESTRICT;

ALTER TABLE fleet_vehicles 
ADD CONSTRAINT fk_fleet_vehicles_model 
FOREIGN KEY (model_id) REFERENCES car_models(id) ON DELETE RESTRICT;

-- Drop the old columns if they exist
ALTER TABLE fleet_vehicles 
DROP COLUMN IF EXISTS brand,
DROP COLUMN IF EXISTS model;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_brand_id ON fleet_vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_model_id ON fleet_vehicles(model_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_status ON fleet_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_license_plate ON fleet_vehicles(license_plate);

-- Update RLS policies if needed
DROP POLICY IF EXISTS "Users can view their own fleet vehicles" ON fleet_vehicles;
DROP POLICY IF EXISTS "Users can insert their own fleet vehicles" ON fleet_vehicles;
DROP POLICY IF EXISTS "Users can update their own fleet vehicles" ON fleet_vehicles;
DROP POLICY IF EXISTS "Users can delete their own fleet vehicles" ON fleet_vehicles;

CREATE POLICY "Users can view their own fleet vehicles"
ON fleet_vehicles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fleet vehicles"
ON fleet_vehicles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fleet vehicles"
ON fleet_vehicles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fleet vehicles"
ON fleet_vehicles FOR DELETE
USING (auth.uid() = user_id);

COMMIT;
