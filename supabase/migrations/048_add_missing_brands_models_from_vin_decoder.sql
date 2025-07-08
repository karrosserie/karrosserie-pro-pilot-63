
-- Migration pour ajouter les marques et modèles manquants du VIN decoder
-- Compléter les tables car_brands et car_models avec tous les éléments détectés par le décodeur VIN

BEGIN;

-- Ajouter les marques manquantes
INSERT INTO public.car_brands (name) VALUES 
  -- Marques manquantes détectées par le VIN decoder
  ('Opel'),
  ('Lexus'),
  ('Infiniti'),
  ('Acura'),
  ('Lincoln'),
  ('Buick'),
  ('GMC'),
  ('Dodge'),
  ('Chrysler'),
  ('Jeep'),
  ('Ram'),
  ('Jaguar'),
  ('Range Rover'),
  ('Bentley'),
  ('Rolls-Royce'),
  ('Aston Martin'),
  ('Maserati'),
  ('McLaren'),
  ('Lotus'),
  ('Bugatti'),
  ('Rivian'),
  ('Lucid'),
  ('Polestar'),
  ('Alpine'),
  ('Mitsubishi'),
  ('Subaru'),
  ('Suzuki'),
  ('Cadillac'),
  ('Lancia'),
  ('Abarth'),
  ('Pagani'),
  ('Saab'),
  ('Koenigsegg'),
  ('Vauxhall'),
  ('SsangYong'),
  ('Haval'),
  ('Lynk & Co'),
  ('Li Auto'),
  ('Maxus'),
  ('GAZ'),
  ('Perodua'),
  ('Proton'),
  ('Spyker'),
  ('Fisker'),
  ('Canoo'),
  ('Lordstown'),
  ('Isuzu')
ON CONFLICT (name) DO NOTHING;

-- Ajouter les modèles manquants pour les marques existantes

-- TOYOTA - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Verso' as model_name UNION ALL SELECT 'Proace' UNION ALL SELECT 'Yaris GR'
) models
WHERE b.name = 'Toyota'
ON CONFLICT (brand_id, name) DO NOTHING;

-- HONDA - Modèles manquants  
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Ridgeline' as model_name UNION ALL SELECT 'e' UNION ALL SELECT 'CR-Z' UNION ALL 
  SELECT 'Civic Type R' UNION ALL SELECT 'Integra'
) models
WHERE b.name = 'Honda'
ON CONFLICT (brand_id, name) DO NOTHING;

-- HYUNDAI - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Azera' as model_name UNION ALL SELECT 'Genesis' UNION ALL SELECT 'i30 N' UNION ALL
  SELECT 'Kona N' UNION ALL SELECT 'Santa Fe N'
) models
WHERE b.name = 'Hyundai'
ON CONFLICT (brand_id, name) DO NOTHING;

-- KIA - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'ProCeed' as model_name UNION ALL SELECT 'EV9'
) models
WHERE b.name = 'Kia'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MAZDA - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'RX-7' as model_name UNION ALL SELECT 'RX-8' UNION ALL SELECT 'CX-60' UNION ALL SELECT 'CX-90'
) models
WHERE b.name = 'Mazda'
ON CONFLICT (brand_id, name) DO NOTHING;

-- FORD - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Expedition' as model_name UNION ALL SELECT 'Tourneo' UNION ALL SELECT 'Maverick' UNION ALL
  SELECT 'E-Transit' UNION ALL SELECT 'Focus ST' UNION ALL SELECT 'Focus RS'
) models
WHERE b.name = 'Ford'
ON CONFLICT (brand_id, name) DO NOTHING;

-- CHEVROLET - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Suburban' as model_name UNION ALL SELECT 'Colorado' UNION ALL SELECT 'Blazer'
) models
WHERE b.name = 'Chevrolet'
ON CONFLICT (brand_id, name) DO NOTHING;

-- PEUGEOT - Modèles manquants (207 détecté par le VIN decoder)
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '207' as model_name UNION ALL SELECT 'e-308' UNION ALL SELECT 'e-Rifter' UNION ALL
  SELECT '208 GTI' UNION ALL SELECT '308 GTI'
) models
WHERE b.name = 'Peugeot'
ON CONFLICT (brand_id, name) DO NOTHING;

-- RENAULT - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Mégane E-Tech' as model_name UNION ALL SELECT 'Clio RS' UNION ALL SELECT 'Mégane RS' UNION ALL
  SELECT 'Alpine A110'
) models
WHERE b.name = 'Renault'
ON CONFLICT (brand_id, name) DO NOTHING;

-- CITROËN - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'C4 Aircross' as model_name UNION ALL SELECT 'ë-Jumpy' UNION ALL SELECT 'C4 Picasso' UNION ALL
  SELECT 'Grand C4 Picasso' UNION ALL SELECT 'DS3' UNION ALL SELECT 'DS4' UNION ALL SELECT 'DS7'
) models
WHERE b.name = 'Citroën'
ON CONFLICT (brand_id, name) DO NOTHING;

-- VOLKSWAGEN - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'ID.7' as model_name UNION ALL SELECT 'Golf GTI' UNION ALL SELECT 'Golf R' UNION ALL
  SELECT 'Scirocco' UNION ALL SELECT 'Beetle'
) models
WHERE b.name = 'Volkswagen'
ON CONFLICT (brand_id, name) DO NOTHING;

-- AUDI - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'RS3' as model_name UNION ALL SELECT 'RS4' UNION ALL SELECT 'RS5' UNION ALL
  SELECT 'RS6' UNION ALL SELECT 'RS7' UNION ALL SELECT 'S3' UNION ALL SELECT 'S4' UNION ALL
  SELECT 'S5' UNION ALL SELECT 'S6' UNION ALL SELECT 'S7' UNION ALL SELECT 'S8'
) models
WHERE b.name = 'Audi'
ON CONFLICT (brand_id, name) DO NOTHING;

-- BMW - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'M2' as model_name UNION ALL SELECT 'M3' UNION ALL SELECT 'M4' UNION ALL
  SELECT 'M5' UNION ALL SELECT 'M8' UNION ALL SELECT 'X3M' UNION ALL SELECT 'X4M' UNION ALL
  SELECT 'X5M' UNION ALL SELECT 'X6M'
) models
WHERE b.name = 'BMW'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MERCEDES-BENZ - Modèles manquants
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'EQA' as model_name UNION ALL SELECT 'EQB' UNION ALL SELECT 'EQC' UNION ALL
  SELECT 'EQE' UNION ALL SELECT 'EQS' UNION ALL SELECT 'EQV' UNION ALL SELECT 'Vito' UNION ALL
  SELECT 'Sprinter' UNION ALL SELECT 'AMG A35' UNION ALL SELECT 'AMG A45' UNION ALL
  SELECT 'AMG C43' UNION ALL SELECT 'AMG C63' UNION ALL SELECT 'AMG E53' UNION ALL SELECT 'AMG E63'
) models
WHERE b.name = 'Mercedes-Benz'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Ajouter des modèles par défaut pour les nouvelles marques
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE b.name IN (
  'Opel', 'Lexus', 'Infiniti', 'Acura', 'Lincoln', 'Buick', 'GMC', 'Dodge', 'Chrysler', 'Jeep', 'Ram',
  'Jaguar', 'Range Rover', 'Bentley', 'Rolls-Royce', 'Aston Martin', 'Maserati', 'McLaren', 'Lotus',
  'Bugatti', 'Rivian', 'Lucid', 'Polestar', 'Alpine', 'Mitsubishi', 'Subaru', 'Suzuki', 'Cadillac',
  'Lancia', 'Abarth', 'Pagani', 'Saab', 'Koenigsegg', 'Vauxhall', 'SsangYong', 'Haval', 'Lynk & Co',
  'Li Auto', 'Maxus', 'GAZ', 'Perodua', 'Proton', 'Spyker', 'Fisker', 'Canoo', 'Lordstown', 'Isuzu'
)
ON CONFLICT (brand_id, name) DO NOTHING;

-- Ajouter quelques modèles spécifiques pour les marques les plus communes détectées par le VIN decoder

-- LEXUS
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'ES' as model_name UNION ALL SELECT 'IS' UNION ALL SELECT 'GS' UNION ALL SELECT 'LS' UNION ALL
  SELECT 'NX' UNION ALL SELECT 'RX' UNION ALL SELECT 'GX' UNION ALL SELECT 'LX' UNION ALL
  SELECT 'LC' UNION ALL SELECT 'RC' UNION ALL SELECT 'UX'
) models
WHERE b.name = 'Lexus'
ON CONFLICT (brand_id, name) DO NOTHING;

-- INFINITI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Q50' as model_name UNION ALL SELECT 'Q60' UNION ALL SELECT 'Q70' UNION ALL
  SELECT 'QX30' UNION ALL SELECT 'QX50' UNION ALL SELECT 'QX60' UNION ALL SELECT 'QX70' UNION ALL SELECT 'QX80'
) models
WHERE b.name = 'Infiniti'
ON CONFLICT (brand_id, name) DO NOTHING;

-- ACURA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'ILX' as model_name UNION ALL SELECT 'TLX' UNION ALL SELECT 'RLX' UNION ALL
  SELECT 'RDX' UNION ALL SELECT 'MDX' UNION ALL SELECT 'NSX'
) models
WHERE b.name = 'Acura'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MITSUBISHI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Mirage' as model_name UNION ALL SELECT 'Lancer' UNION ALL SELECT 'Outlander' UNION ALL
  SELECT 'Eclipse Cross' UNION ALL SELECT 'ASX' UNION ALL SELECT 'Pajero' UNION ALL SELECT 'L200'
) models
WHERE b.name = 'Mitsubishi'
ON CONFLICT (brand_id, name) DO NOTHING;

-- SUBARU
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Impreza' as model_name UNION ALL SELECT 'Legacy' UNION ALL SELECT 'Outback' UNION ALL
  SELECT 'Forester' UNION ALL SELECT 'XV' UNION ALL SELECT 'Ascent' UNION ALL SELECT 'WRX' UNION ALL SELECT 'BRZ'
) models
WHERE b.name = 'Subaru'
ON CONFLICT (brand_id, name) DO NOTHING;

-- SUZUKI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Swift' as model_name UNION ALL SELECT 'Baleno' UNION ALL SELECT 'Vitara' UNION ALL
  SELECT 'S-Cross' UNION ALL SELECT 'Jimny' UNION ALL SELECT 'Ignis'
) models
WHERE b.name = 'Suzuki'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mettre à jour les timestamps
UPDATE public.car_brands SET updated_at = NOW();
UPDATE public.car_models SET updated_at = NOW();

COMMIT;
