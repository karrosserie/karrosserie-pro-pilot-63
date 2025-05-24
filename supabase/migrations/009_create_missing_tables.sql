
-- Create missing lookup tables for the application

-- Create car_brands table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.car_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create car_models table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.car_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.car_brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, name)
);

-- Create insurance_companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.insurance_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert car brands with demo data
INSERT INTO public.car_brands (name) VALUES 
  ('Audi'), 
  ('BMW'), 
  ('Mercedes-Benz'), 
  ('Volkswagen'), 
  ('Peugeot'), 
  ('Renault'), 
  ('Citroën'), 
  ('Ford'), 
  ('Opel'), 
  ('Toyota'),
  ('Nissan'),
  ('Volvo'),
  ('Fiat'),
  ('Seat'),
  ('Skoda'),
  ('Autre')
ON CONFLICT (name) DO NOTHING;

-- Insert car models for major brands
-- Audi models
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'A1' as model_name UNION ALL SELECT 'A3' UNION ALL SELECT 'A4' UNION ALL 
  SELECT 'A5' UNION ALL SELECT 'A6' UNION ALL SELECT 'A7' UNION ALL SELECT 'A8' UNION ALL 
  SELECT 'Q3' UNION ALL SELECT 'Q5' UNION ALL SELECT 'Q7' UNION ALL SELECT 'Q8' UNION ALL 
  SELECT 'TT' UNION ALL SELECT 'e-tron'
) models
WHERE b.name = 'Audi'
ON CONFLICT (brand_id, name) DO NOTHING;

-- BMW models
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Série 1' as model_name UNION ALL SELECT 'Série 2' UNION ALL SELECT 'Série 3' UNION ALL 
  SELECT 'Série 4' UNION ALL SELECT 'Série 5' UNION ALL SELECT 'Série 6' UNION ALL SELECT 'Série 7' UNION ALL 
  SELECT 'X1' UNION ALL SELECT 'X2' UNION ALL SELECT 'X3' UNION ALL SELECT 'X4' UNION ALL 
  SELECT 'X5' UNION ALL SELECT 'X6' UNION ALL SELECT 'X7' UNION ALL SELECT 'i3' UNION ALL SELECT 'i4'
) models
WHERE b.name = 'BMW'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mercedes-Benz models
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Classe A' as model_name UNION ALL SELECT 'Classe B' UNION ALL SELECT 'Classe C' UNION ALL 
  SELECT 'Classe E' UNION ALL SELECT 'Classe S' UNION ALL SELECT 'GLA' UNION ALL 
  SELECT 'GLB' UNION ALL SELECT 'GLC' UNION ALL SELECT 'GLE' UNION ALL SELECT 'GLS' UNION ALL
  SELECT 'EQA' UNION ALL SELECT 'EQC'
) models
WHERE b.name = 'Mercedes-Benz'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Volkswagen models
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Polo' as model_name UNION ALL SELECT 'Golf' UNION ALL SELECT 'Passat' UNION ALL 
  SELECT 'Tiguan' UNION ALL SELECT 'Touareg' UNION ALL SELECT 'T-Roc' UNION ALL
  SELECT 'ID.3' UNION ALL SELECT 'ID.4'
) models
WHERE b.name = 'Volkswagen'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Peugeot models
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '108' as model_name UNION ALL SELECT '208' UNION ALL SELECT '308' UNION ALL 
  SELECT '508' UNION ALL SELECT '2008' UNION ALL SELECT '3008' UNION ALL SELECT '5008' UNION ALL
  SELECT 'e-208' UNION ALL SELECT 'e-2008'
) models
WHERE b.name = 'Peugeot'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Renault models
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Twingo' as model_name UNION ALL SELECT 'Clio' UNION ALL SELECT 'Mégane' UNION ALL 
  SELECT 'Talisman' UNION ALL SELECT 'Captur' UNION ALL SELECT 'Kadjar' UNION ALL SELECT 'Koleos' UNION ALL
  SELECT 'ZOE' UNION ALL SELECT 'Mégane E-Tech'
) models
WHERE b.name = 'Renault'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Add models for other brands
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE b.name = 'Autre'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Insert insurance companies with demo data
INSERT INTO public.insurance_companies (name) VALUES 
  ('AXA'), 
  ('Allianz'), 
  ('Generali'), 
  ('MAIF'), 
  ('MACIF'), 
  ('MAAF'), 
  ('Groupama'), 
  ('Crédit Agricole Assurances'), 
  ('Matmut'), 
  ('Direct Assurance'),
  ('Zurich'),
  ('Aviva'),
  ('MMA'),
  ('GMF'),
  ('Autre')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on the new tables
ALTER TABLE public.car_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (these are lookup tables)
CREATE POLICY "Allow public read access to car brands" ON public.car_brands
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to car models" ON public.car_models
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to insurance companies" ON public.insurance_companies
  FOR SELECT USING (true);
