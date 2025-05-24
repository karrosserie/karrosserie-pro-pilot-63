
-- Update types to include new lookup tables

-- This migration ensures that the TypeScript types are updated
-- to include the new lookup tables we created

-- The tables car_brands, car_models, and insurance_companies
-- should now be available in the Database type definitions

-- Add any additional constraints or indexes if needed
CREATE INDEX IF NOT EXISTS idx_car_models_brand_id ON public.car_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_car_brands_name ON public.car_brands(name);
CREATE INDEX IF NOT EXISTS idx_insurance_companies_name ON public.insurance_companies(name);

-- Update the updated_at timestamps when records are modified
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic updated_at handling
DROP TRIGGER IF EXISTS update_car_brands_updated_at ON public.car_brands;
CREATE TRIGGER update_car_brands_updated_at
    BEFORE UPDATE ON public.car_brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_car_models_updated_at ON public.car_models;
CREATE TRIGGER update_car_models_updated_at
    BEFORE UPDATE ON public.car_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_insurance_companies_updated_at ON public.insurance_companies;
CREATE TRIGGER update_insurance_companies_updated_at
    BEFORE UPDATE ON public.insurance_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
