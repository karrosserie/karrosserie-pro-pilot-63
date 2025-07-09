
-- Remove fuel_type column and add insurance_company_id foreign key to vehicles table
ALTER TABLE vehicles DROP COLUMN IF EXISTS fuel_type;

-- Add insurance_company_id column as foreign key
ALTER TABLE vehicles ADD COLUMN insurance_company_id UUID REFERENCES insurance_companies(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_insurance_company_id ON vehicles(insurance_company_id);

-- Migrate existing insurance_company text values to insurance_company_id
-- This will try to match existing text values with insurance company names
UPDATE vehicles 
SET insurance_company_id = ic.id 
FROM insurance_companies ic 
WHERE vehicles.insurance_company = ic.name;

-- Remove the old insurance_company text column after migration
ALTER TABLE vehicles DROP COLUMN IF EXISTS insurance_company;
