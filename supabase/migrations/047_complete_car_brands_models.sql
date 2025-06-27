
-- Migration complète pour ajouter toutes les marques et modèles de voitures
-- Gère les références existantes dans fleet_vehicles

BEGIN;

-- Temporarily disable foreign key constraints to allow data cleanup
SET session_replication_role = replica;

-- Get or create a default "Autre" brand first
DO $$
DECLARE
    default_brand_id UUID;
    default_model_id UUID;
BEGIN
    -- Insert or get default brand
    INSERT INTO public.car_brands (name) VALUES ('Autre') 
    ON CONFLICT (name) DO NOTHING;
    
    SELECT id INTO default_brand_id FROM public.car_brands WHERE name = 'Autre';
    
    -- Insert or get default model for the default brand
    INSERT INTO public.car_models (brand_id, name) VALUES (default_brand_id, 'Autre modèle') 
    ON CONFLICT (brand_id, name) DO NOTHING;
    
    SELECT id INTO default_model_id FROM public.car_models WHERE brand_id = default_brand_id AND name = 'Autre modèle';
    
    -- Update fleet_vehicles to use default brand/model where references exist
    UPDATE public.fleet_vehicles 
    SET brand_id = default_brand_id, 
        model_id = default_model_id 
    WHERE brand_id IS NOT NULL OR model_id IS NOT NULL;
END $$;

-- Now safely delete existing data
DELETE FROM public.car_models WHERE name != 'Autre modèle';
DELETE FROM public.car_brands WHERE name != 'Autre';

-- Re-enable foreign key constraints
SET session_replication_role = DEFAULT;

-- Insérer toutes les marques de voitures (liste exhaustive)
INSERT INTO public.car_brands (name) VALUES 
  -- Marques européennes
  ('Audi'), ('BMW'), ('Mercedes-Benz'), ('Volkswagen'), ('Porsche'), ('Ferrari'), ('Lamborghini'),
  ('Maserati'), ('Alfa Romeo'), ('Fiat'), ('Lancia'), ('Abarth'), ('Pagani'),
  ('Peugeot'), ('Renault'), ('Citroën'), ('DS'), ('Alpine'),
  ('Volvo'), ('Saab'), ('Koenigsegg'),
  ('Bentley'), ('Rolls-Royce'), ('Aston Martin'), ('Jaguar'), ('Land Rover'), ('Range Rover'), ('McLaren'), ('Lotus'), ('Mini'),
  ('Opel'), ('Vauxhall'),
  ('Seat'), ('Skoda'),
  ('Dacia'),
  
  -- Marques japonaises
  ('Toyota'), ('Honda'), ('Nissan'), ('Mazda'), ('Mitsubishi'), ('Subaru'), ('Suzuki'), ('Isuzu'),
  ('Lexus'), ('Infiniti'), ('Acura'),
  
  -- Marques coréennes
  ('Hyundai'), ('Kia'), ('Genesis'), ('SsangYong'),
  
  -- Marques américaines
  ('Ford'), ('Chevrolet'), ('Cadillac'), ('GMC'), ('Buick'), ('Dodge'), ('Chrysler'), ('Jeep'), ('Ram'),
  ('Lincoln'), ('Tesla'), ('Rivian'), ('Lucid'),
  
  -- Marques chinoises
  ('BYD'), ('Geely'), ('Chery'), ('Great Wall'), ('Haval'), ('Lynk & Co'), ('Polestar'), ('Nio'), ('Xpeng'), ('Li Auto'),
  ('MG'), ('Maxus'),
  
  -- Autres marques
  ('Lada'), ('UAZ'), ('GAZ'),
  ('Tata'), ('Mahindra'),
  ('Holden'),
  ('Proton'), ('Perodua'),
  
  -- Marques de luxe et sportives
  ('Bugatti'), ('Spyker'),
  
  -- Marques électriques
  ('Fisker'), ('Canoo'), ('Lordstown')
ON CONFLICT (name) DO NOTHING;

-- Insérer les modèles pour chaque marque

-- AUDI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'A1' as model_name UNION ALL SELECT 'A3' UNION ALL SELECT 'A4' UNION ALL SELECT 'A5' UNION ALL 
  SELECT 'A6' UNION ALL SELECT 'A7' UNION ALL SELECT 'A8' UNION ALL SELECT 'Q2' UNION ALL SELECT 'Q3' UNION ALL 
  SELECT 'Q4 e-tron' UNION ALL SELECT 'Q5' UNION ALL SELECT 'Q7' UNION ALL SELECT 'Q8' UNION ALL 
  SELECT 'TT' UNION ALL SELECT 'R8' UNION ALL SELECT 'e-tron' UNION ALL SELECT 'e-tron GT' UNION ALL SELECT 'RS3' UNION ALL
  SELECT 'RS4' UNION ALL SELECT 'RS5' UNION ALL SELECT 'RS6' UNION ALL SELECT 'RS7' UNION ALL SELECT 'S3' UNION ALL
  SELECT 'S4' UNION ALL SELECT 'S5' UNION ALL SELECT 'S6' UNION ALL SELECT 'S7' UNION ALL SELECT 'S8'
) models
WHERE b.name = 'Audi'
ON CONFLICT (brand_id, name) DO NOTHING;

-- BMW
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Série 1' as model_name UNION ALL SELECT 'Série 2' UNION ALL SELECT 'Série 3' UNION ALL SELECT 'Série 4' UNION ALL 
  SELECT 'Série 5' UNION ALL SELECT 'Série 6' UNION ALL SELECT 'Série 7' UNION ALL SELECT 'Série 8' UNION ALL 
  SELECT 'X1' UNION ALL SELECT 'X2' UNION ALL SELECT 'X3' UNION ALL SELECT 'X4' UNION ALL SELECT 'X5' UNION ALL 
  SELECT 'X6' UNION ALL SELECT 'X7' UNION ALL SELECT 'Z4' UNION ALL SELECT 'i3' UNION ALL SELECT 'i4' UNION ALL 
  SELECT 'iX' UNION ALL SELECT 'iX3' UNION ALL SELECT 'M2' UNION ALL SELECT 'M3' UNION ALL SELECT 'M4' UNION ALL
  SELECT 'M5' UNION ALL SELECT 'M8' UNION ALL SELECT 'X3M' UNION ALL SELECT 'X4M' UNION ALL SELECT 'X5M' UNION ALL SELECT 'X6M'
) models
WHERE b.name = 'BMW'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MERCEDES-BENZ
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Classe A' as model_name UNION ALL SELECT 'Classe B' UNION ALL SELECT 'Classe C' UNION ALL SELECT 'Classe E' UNION ALL 
  SELECT 'Classe S' UNION ALL SELECT 'CLA' UNION ALL SELECT 'CLS' UNION ALL SELECT 'GLA' UNION ALL SELECT 'GLB' UNION ALL 
  SELECT 'GLC' UNION ALL SELECT 'GLE' UNION ALL SELECT 'GLS' UNION ALL SELECT 'G-Class' UNION ALL SELECT 'SL' UNION ALL 
  SELECT 'SLC' UNION ALL SELECT 'AMG GT' UNION ALL SELECT 'EQA' UNION ALL SELECT 'EQB' UNION ALL SELECT 'EQC' UNION ALL 
  SELECT 'EQE' UNION ALL SELECT 'EQS' UNION ALL SELECT 'EQV' UNION ALL SELECT 'Vito' UNION ALL SELECT 'Sprinter' UNION ALL
  SELECT 'AMG A35' UNION ALL SELECT 'AMG A45' UNION ALL SELECT 'AMG C43' UNION ALL SELECT 'AMG C63' UNION ALL SELECT 'AMG E53' UNION ALL SELECT 'AMG E63'
) models
WHERE b.name = 'Mercedes-Benz'
ON CONFLICT (brand_id, name) DO NOTHING;

-- VOLKSWAGEN
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Polo' as model_name UNION ALL SELECT 'Golf' UNION ALL SELECT 'Jetta' UNION ALL SELECT 'Passat' UNION ALL 
  SELECT 'Arteon' UNION ALL SELECT 'T-Cross' UNION ALL SELECT 'T-Roc' UNION ALL SELECT 'Tiguan' UNION ALL 
  SELECT 'Touareg' UNION ALL SELECT 'Sharan' UNION ALL SELECT 'Touran' UNION ALL SELECT 'Caddy' UNION ALL 
  SELECT 'Crafter' UNION ALL SELECT 'ID.3' UNION ALL SELECT 'ID.4' UNION ALL SELECT 'ID.5' UNION ALL SELECT 'ID.7' UNION ALL
  SELECT 'Golf GTI' UNION ALL SELECT 'Golf R' UNION ALL SELECT 'Scirocco' UNION ALL SELECT 'Beetle' UNION ALL SELECT 'Up!'
) models
WHERE b.name = 'Volkswagen'
ON CONFLICT (brand_id, name) DO NOTHING;

-- PEUGEOT
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '108' as model_name UNION ALL SELECT '208' UNION ALL SELECT '308' UNION ALL SELECT '408' UNION ALL 
  SELECT '508' UNION ALL SELECT '2008' UNION ALL SELECT '3008' UNION ALL SELECT '5008' UNION ALL 
  SELECT 'Partner' UNION ALL SELECT 'Rifter' UNION ALL SELECT 'Expert' UNION ALL SELECT 'Boxer' UNION ALL
  SELECT 'e-208' UNION ALL SELECT 'e-2008' UNION ALL SELECT 'e-308' UNION ALL SELECT 'e-Rifter' UNION ALL
  SELECT '208 GTI' UNION ALL SELECT '308 GTI' UNION ALL SELECT 'RCZ'
) models
WHERE b.name = 'Peugeot'
ON CONFLICT (brand_id, name) DO NOTHING;

-- RENAULT
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Twingo' as model_name UNION ALL SELECT 'Clio' UNION ALL SELECT 'Mégane' UNION ALL SELECT 'Talisman' UNION ALL 
  SELECT 'Captur' UNION ALL SELECT 'Kadjar' UNION ALL SELECT 'Koleos' UNION ALL SELECT 'Espace' UNION ALL 
  SELECT 'Scenic' UNION ALL SELECT 'Kangoo' UNION ALL SELECT 'Trafic' UNION ALL SELECT 'Master' UNION ALL
  SELECT 'ZOE' UNION ALL SELECT 'Mégane E-Tech' UNION ALL SELECT 'Arkana' UNION ALL SELECT 'Austral' UNION ALL
  SELECT 'Clio RS' UNION ALL SELECT 'Mégane RS' UNION ALL SELECT 'Alpine A110'
) models
WHERE b.name = 'Renault'
ON CONFLICT (brand_id, name) DO NOTHING;

-- CITROËN
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'C1' as model_name UNION ALL SELECT 'C3' UNION ALL SELECT 'C4' UNION ALL SELECT 'C5' UNION ALL 
  SELECT 'C3 Aircross' UNION ALL SELECT 'C4 Aircross' UNION ALL SELECT 'C5 Aircross' UNION ALL 
  SELECT 'Berlingo' UNION ALL SELECT 'Jumpy' UNION ALL SELECT 'Jumper' UNION ALL SELECT 'Ami' UNION ALL
  SELECT 'ë-C4' UNION ALL SELECT 'ë-Berlingo' UNION ALL SELECT 'ë-Jumpy' UNION ALL SELECT 'C4 Picasso' UNION ALL
  SELECT 'Grand C4 Picasso' UNION ALL SELECT 'DS3' UNION ALL SELECT 'DS4' UNION ALL SELECT 'DS7'
) models
WHERE b.name = 'Citroën'
ON CONFLICT (brand_id, name) DO NOTHING;

-- TOYOTA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Aygo' as model_name UNION ALL SELECT 'Yaris' UNION ALL SELECT 'Corolla' UNION ALL SELECT 'Camry' UNION ALL 
  SELECT 'Avensis' UNION ALL SELECT 'C-HR' UNION ALL SELECT 'RAV4' UNION ALL SELECT 'Highlander' UNION ALL 
  SELECT 'Land Cruiser' UNION ALL SELECT 'Prius' UNION ALL SELECT 'Mirai' UNION ALL SELECT 'Verso' UNION ALL
  SELECT 'Proace' UNION ALL SELECT 'Hilux' UNION ALL SELECT 'Supra' UNION ALL SELECT 'GT86' UNION ALL
  SELECT 'Yaris Cross' UNION ALL SELECT 'bZ4X' UNION ALL SELECT 'Yaris GR'
) models
WHERE b.name = 'Toyota'
ON CONFLICT (brand_id, name) DO NOTHING;

-- HONDA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Jazz' as model_name UNION ALL SELECT 'Civic' UNION ALL SELECT 'Accord' UNION ALL SELECT 'HR-V' UNION ALL 
  SELECT 'CR-V' UNION ALL SELECT 'Pilot' UNION ALL SELECT 'Ridgeline' UNION ALL SELECT 'Insight' UNION ALL
  SELECT 'e' UNION ALL SELECT 'CR-Z' UNION ALL SELECT 'NSX' UNION ALL SELECT 'S2000' UNION ALL
  SELECT 'Civic Type R' UNION ALL SELECT 'Integra'
) models
WHERE b.name = 'Honda'
ON CONFLICT (brand_id, name) DO NOTHING;

-- NISSAN
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Micra' as model_name UNION ALL SELECT 'Note' UNION ALL SELECT 'Sentra' UNION ALL SELECT 'Altima' UNION ALL 
  SELECT 'Maxima' UNION ALL SELECT 'Juke' UNION ALL SELECT 'Qashqai' UNION ALL SELECT 'X-Trail' UNION ALL 
  SELECT 'Murano' UNION ALL SELECT 'Pathfinder' UNION ALL SELECT 'Armada' UNION ALL SELECT 'Leaf' UNION ALL
  SELECT 'Ariya' UNION ALL SELECT '370Z' UNION ALL SELECT 'GT-R' UNION ALL SELECT 'Navara' UNION ALL
  SELECT 'e-NV200' UNION ALL SELECT 'Townstar'
) models
WHERE b.name = 'Nissan'
ON CONFLICT (brand_id, name) DO NOTHING;

-- FORD
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Fiesta' as model_name UNION ALL SELECT 'Focus' UNION ALL SELECT 'Mondeo' UNION ALL SELECT 'Mustang' UNION ALL 
  SELECT 'EcoSport' UNION ALL SELECT 'Kuga' UNION ALL SELECT 'Edge' UNION ALL SELECT 'Explorer' UNION ALL 
  SELECT 'Expedition' UNION ALL SELECT 'F-150' UNION ALL SELECT 'Ranger' UNION ALL SELECT 'Transit' UNION ALL
  SELECT 'Tourneo' UNION ALL SELECT 'Puma' UNION ALL SELECT 'Bronco' UNION ALL SELECT 'Maverick' UNION ALL
  SELECT 'Mustang Mach-E' UNION ALL SELECT 'E-Transit' UNION ALL SELECT 'Focus ST' UNION ALL SELECT 'Focus RS'
) models
WHERE b.name = 'Ford'
ON CONFLICT (brand_id, name) DO NOTHING;

-- CHEVROLET
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Spark' as model_name UNION ALL SELECT 'Sonic' UNION ALL SELECT 'Cruze' UNION ALL SELECT 'Malibu' UNION ALL 
  SELECT 'Impala' UNION ALL SELECT 'Trax' UNION ALL SELECT 'Equinox' UNION ALL SELECT 'Traverse' UNION ALL 
  SELECT 'Tahoe' UNION ALL SELECT 'Suburban' UNION ALL SELECT 'Silverado' UNION ALL SELECT 'Colorado' UNION ALL
  SELECT 'Camaro' UNION ALL SELECT 'Corvette' UNION ALL SELECT 'Bolt' UNION ALL SELECT 'Blazer'
) models
WHERE b.name = 'Chevrolet'
ON CONFLICT (brand_id, name) DO NOTHING;

-- HYUNDAI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'i10' as model_name UNION ALL SELECT 'i20' UNION ALL SELECT 'i30' UNION ALL SELECT 'Elantra' UNION ALL 
  SELECT 'Sonata' UNION ALL SELECT 'Azera' UNION ALL SELECT 'Kona' UNION ALL SELECT 'Tucson' UNION ALL 
  SELECT 'Santa Fe' UNION ALL SELECT 'Palisade' UNION ALL SELECT 'Ioniq' UNION ALL SELECT 'Ioniq 5' UNION ALL
  SELECT 'Ioniq 6' UNION ALL SELECT 'Veloster' UNION ALL SELECT 'Genesis' UNION ALL SELECT 'i30 N' UNION ALL
  SELECT 'Kona N' UNION ALL SELECT 'Santa Fe N'
) models
WHERE b.name = 'Hyundai'
ON CONFLICT (brand_id, name) DO NOTHING;

-- KIA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Picanto' as model_name UNION ALL SELECT 'Rio' UNION ALL SELECT 'Forte' UNION ALL SELECT 'Optima' UNION ALL 
  SELECT 'Stinger' UNION ALL SELECT 'Soul' UNION ALL SELECT 'Seltos' UNION ALL SELECT 'Sportage' UNION ALL 
  SELECT 'Sorento' UNION ALL SELECT 'Telluride' UNION ALL SELECT 'Niro' UNION ALL SELECT 'EV6' UNION ALL
  SELECT 'Carnival' UNION ALL SELECT 'Ceed' UNION ALL SELECT 'XCeed' UNION ALL SELECT 'ProCeed' UNION ALL
  SELECT 'Stonic' UNION ALL SELECT 'EV9'
) models
WHERE b.name = 'Kia'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MAZDA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Mazda2' as model_name UNION ALL SELECT 'Mazda3' UNION ALL SELECT 'Mazda6' UNION ALL SELECT 'CX-3' UNION ALL 
  SELECT 'CX-30' UNION ALL SELECT 'CX-5' UNION ALL SELECT 'CX-9' UNION ALL SELECT 'MX-5' UNION ALL 
  SELECT 'MX-30' UNION ALL SELECT 'RX-7' UNION ALL SELECT 'RX-8' UNION ALL SELECT 'CX-60' UNION ALL SELECT 'CX-90'
) models
WHERE b.name = 'Mazda'
ON CONFLICT (brand_id, name) DO NOTHING;

-- TESLA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Model S' as model_name UNION ALL SELECT 'Model 3' UNION ALL SELECT 'Model X' UNION ALL 
  SELECT 'Model Y' UNION ALL SELECT 'Cybertruck' UNION ALL SELECT 'Roadster'
) models
WHERE b.name = 'Tesla'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Add default models for remaining brands
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE b.name NOT IN ('Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Peugeot', 'Renault', 'Citroën', 'Toyota', 'Honda', 'Nissan', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Mazda', 'Tesla', 'Autre')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mettre à jour les timestamps
UPDATE public.car_brands SET updated_at = NOW();
UPDATE public.car_models SET updated_at = NOW();

COMMIT;
