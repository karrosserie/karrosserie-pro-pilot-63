
-- Create car_brands table
CREATE TABLE IF NOT EXISTS public.car_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create car_models table
CREATE TABLE IF NOT EXISTS public.car_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.car_brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, name)
);

-- Create insurance_companies table
CREATE TABLE IF NOT EXISTS public.insurance_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert car brands
INSERT INTO public.car_brands (name) VALUES 
  ('Audi'), ('BMW'), ('Citroën'), ('Ford'), ('Mercedes-Benz'), 
  ('Nissan'), ('Opel'), ('Peugeot'), ('Renault'), ('Toyota'), 
  ('Volkswagen'), ('Volvo'), ('Autre')
ON CONFLICT (name) DO NOTHING;

-- Insert car models for each brand
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'A1' as model_name UNION ALL SELECT 'A3' UNION ALL SELECT 'A4' UNION ALL 
  SELECT 'A5' UNION ALL SELECT 'A6' UNION ALL SELECT 'A7' UNION ALL SELECT 'A8' UNION ALL 
  SELECT 'Q3' UNION ALL SELECT 'Q5' UNION ALL SELECT 'Q7' UNION ALL SELECT 'Q8' UNION ALL SELECT 'TT'
) models
WHERE b.name = 'Audi'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Série 1' as model_name UNION ALL SELECT 'Série 2' UNION ALL SELECT 'Série 3' UNION ALL 
  SELECT 'Série 4' UNION ALL SELECT 'Série 5' UNION ALL SELECT 'Série 6' UNION ALL SELECT 'Série 7' UNION ALL 
  SELECT 'X1' UNION ALL SELECT 'X2' UNION ALL SELECT 'X3' UNION ALL SELECT 'X4' UNION ALL 
  SELECT 'X5' UNION ALL SELECT 'X6' UNION ALL SELECT 'X7'
) models
WHERE b.name = 'BMW'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'C1' as model_name UNION ALL SELECT 'C3' UNION ALL SELECT 'C4' UNION ALL 
  SELECT 'C5' UNION ALL SELECT 'C6' UNION ALL SELECT 'Berlingo' UNION ALL 
  SELECT 'Picasso' UNION ALL SELECT 'Jumpy'
) models
WHERE b.name = 'Citroën'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Fiesta' as model_name UNION ALL SELECT 'Focus' UNION ALL SELECT 'Mondeo' UNION ALL 
  SELECT 'Kuga' UNION ALL SELECT 'Mustang' UNION ALL SELECT 'Transit'
) models
WHERE b.name = 'Ford'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Classe A' as model_name UNION ALL SELECT 'Classe B' UNION ALL SELECT 'Classe C' UNION ALL 
  SELECT 'Classe E' UNION ALL SELECT 'Classe S' UNION ALL SELECT 'GLA' UNION ALL 
  SELECT 'GLB' UNION ALL SELECT 'GLC' UNION ALL SELECT 'GLE' UNION ALL SELECT 'GLS'
) models
WHERE b.name = 'Mercedes-Benz'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Micra' as model_name UNION ALL SELECT 'Note' UNION ALL SELECT 'Juke' UNION ALL 
  SELECT 'Qashqai' UNION ALL SELECT 'X-Trail' UNION ALL SELECT 'Leaf'
) models
WHERE b.name = 'Nissan'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Corsa' as model_name UNION ALL SELECT 'Astra' UNION ALL SELECT 'Insignia' UNION ALL 
  SELECT 'Crossland' UNION ALL SELECT 'Grandland'
) models
WHERE b.name = 'Opel'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '108' as model_name UNION ALL SELECT '208' UNION ALL SELECT '308' UNION ALL 
  SELECT '508' UNION ALL SELECT '2008' UNION ALL SELECT '3008' UNION ALL SELECT '5008'
) models
WHERE b.name = 'Peugeot'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Twingo' as model_name UNION ALL SELECT 'Clio' UNION ALL SELECT 'Mégane' UNION ALL 
  SELECT 'Talisman' UNION ALL SELECT 'Captur' UNION ALL SELECT 'Kadjar' UNION ALL SELECT 'Koleos'
) models
WHERE b.name = 'Renault'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Yaris' as model_name UNION ALL SELECT 'Corolla' UNION ALL SELECT 'Camry' UNION ALL 
  SELECT 'Prius' UNION ALL SELECT 'RAV4' UNION ALL SELECT 'Highlander'
) models
WHERE b.name = 'Toyota'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Polo' as model_name UNION ALL SELECT 'Golf' UNION ALL SELECT 'Passat' UNION ALL 
  SELECT 'Tiguan' UNION ALL SELECT 'Touareg' UNION ALL SELECT 'T-Roc'
) models
WHERE b.name = 'Volkswagen'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'V40' as model_name UNION ALL SELECT 'V60' UNION ALL SELECT 'V90' UNION ALL 
  SELECT 'XC40' UNION ALL SELECT 'XC60' UNION ALL SELECT 'XC90'
) models
WHERE b.name = 'Volvo'
ON CONFLICT (brand_id, name) DO NOTHING;

INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE b.name = 'Autre'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Insert insurance companies
INSERT INTO public.insurance_companies (name) VALUES 
  ('AXA'), ('Allianz'), ('Generali'), ('Zurich'), ('Bâloise'), 
  ('Helvetia'), ('Mobilière'), ('Vaudoise'), ('CSS'), ('Sympany'), ('Autre')
ON CONFLICT (name) DO NOTHING;
