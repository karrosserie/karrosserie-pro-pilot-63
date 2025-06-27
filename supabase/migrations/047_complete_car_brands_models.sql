
-- Migration complète pour ajouter toutes les marques et modèles de voitures

-- Supprimer les données existantes pour éviter les conflits
DELETE FROM public.car_models;
DELETE FROM public.car_brands;

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
  ('Bugatti'), ('Koenigsegg'), ('Pagani'), ('McLaren'), ('Spyker'),
  
  -- Marques électriques
  ('Rivian'), ('Lucid'), ('Fisker'), ('Canoo'), ('Lordstown'),
  
  -- Autres
  ('Autre')
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

-- JAGUAR
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'XE' as model_name UNION ALL SELECT 'XF' UNION ALL SELECT 'XJ' UNION ALL SELECT 'F-Type' UNION ALL 
  SELECT 'E-Pace' UNION ALL SELECT 'F-Pace' UNION ALL SELECT 'I-Pace' UNION ALL SELECT 'XK'
) models
WHERE b.name = 'Jaguar'
ON CONFLICT (brand_id, name) DO NOTHING;

-- LAND ROVER
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Defender' as model_name UNION ALL SELECT 'Discovery' UNION ALL SELECT 'Discovery Sport' UNION ALL 
  SELECT 'Range Rover' UNION ALL SELECT 'Range Rover Sport' UNION ALL SELECT 'Range Rover Evoque' UNION ALL 
  SELECT 'Range Rover Velar' UNION ALL SELECT 'Freelander'
) models
WHERE b.name = 'Land Rover'
ON CONFLICT (brand_id, name) DO NOTHING;

-- VOLVO
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'S60' as model_name UNION ALL SELECT 'S90' UNION ALL SELECT 'V60' UNION ALL SELECT 'V90' UNION ALL 
  SELECT 'XC40' UNION ALL SELECT 'XC60' UNION ALL SELECT 'XC90' UNION ALL SELECT 'C40' UNION ALL 
  SELECT 'EX30' UNION ALL SELECT 'EX90' UNION ALL SELECT 'V40'
) models
WHERE b.name = 'Volvo'
ON CONFLICT (brand_id, name) DO NOTHING;

-- PORSCHE
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '911' as model_name UNION ALL SELECT 'Boxster' UNION ALL SELECT 'Cayman' UNION ALL SELECT 'Panamera' UNION ALL 
  SELECT 'Macan' UNION ALL SELECT 'Cayenne' UNION ALL SELECT 'Taycan' UNION ALL SELECT '718'
) models
WHERE b.name = 'Porsche'
ON CONFLICT (brand_id, name) DO NOTHING;

-- FERRARI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '488' as model_name UNION ALL SELECT 'F8' UNION ALL SELECT 'SF90' UNION ALL SELECT 'Roma' UNION ALL 
  SELECT 'Portofino' UNION ALL SELECT '812' UNION ALL SELECT 'LaFerrari' UNION ALL SELECT 'GTC4Lusso' UNION ALL
  SELECT '296 GTB' UNION ALL SELECT 'Purosangue'
) models
WHERE b.name = 'Ferrari'
ON CONFLICT (brand_id, name) DO NOTHING;

-- LAMBORGHINI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Huracán' as model_name UNION ALL SELECT 'Aventador' UNION ALL SELECT 'Urus' UNION ALL 
  SELECT 'Gallardo' UNION ALL SELECT 'Murciélago' UNION ALL SELECT 'Revuelto'
) models
WHERE b.name = 'Lamborghini'
ON CONFLICT (brand_id, name) DO NOTHING;

-- FIAT
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '500' as model_name UNION ALL SELECT 'Panda' UNION ALL SELECT 'Punto' UNION ALL SELECT 'Tipo' UNION ALL 
  SELECT '500X' UNION ALL SELECT '500L' UNION ALL SELECT 'Ducato' UNION ALL SELECT 'Doblo' UNION ALL
  SELECT '500e' UNION ALL SELECT 'Topolino'
) models
WHERE b.name = 'Fiat'
ON CONFLICT (brand_id, name) DO NOTHING;

-- ALFA ROMEO
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Giulia' as model_name UNION ALL SELECT 'Stelvio' UNION ALL SELECT 'Giulietta' UNION ALL 
  SELECT 'Tonale' UNION ALL SELECT '4C' UNION ALL SELECT 'MiTo' UNION ALL SELECT 'GTV'
) models
WHERE b.name = 'Alfa Romeo'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MINI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Cooper' as model_name UNION ALL SELECT 'Clubman' UNION ALL SELECT 'Countryman' UNION ALL 
  SELECT 'Paceman' UNION ALL SELECT 'Roadster' UNION ALL SELECT 'Coupe' UNION ALL SELECT 'Electric'
) models
WHERE b.name = 'Mini'
ON CONFLICT (brand_id, name) DO NOTHING;

-- OPEL
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Corsa' as model_name UNION ALL SELECT 'Astra' UNION ALL SELECT 'Insignia' UNION ALL SELECT 'Mokka' UNION ALL 
  SELECT 'Crossland' UNION ALL SELECT 'Grandland' UNION ALL SELECT 'Combo' UNION ALL SELECT 'Vivaro' UNION ALL
  SELECT 'Movano' UNION ALL SELECT 'Corsa-e' UNION ALL SELECT 'Mokka-e' UNION ALL SELECT 'Zafira'
) models
WHERE b.name = 'Opel'
ON CONFLICT (brand_id, name) DO NOTHING;

-- SEAT
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Ibiza' as model_name UNION ALL SELECT 'Leon' UNION ALL SELECT 'Arona' UNION ALL SELECT 'Ateca' UNION ALL 
  SELECT 'Tarraco' UNION ALL SELECT 'Mii' UNION ALL SELECT 'Toledo' UNION ALL SELECT 'Alhambra' UNION ALL
  SELECT 'Leon Cupra' UNION ALL SELECT 'Ateca Cupra'
) models
WHERE b.name = 'Seat'
ON CONFLICT (brand_id, name) DO NOTHING;

-- SKODA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Citigo' as model_name UNION ALL SELECT 'Fabia' UNION ALL SELECT 'Scala' UNION ALL SELECT 'Octavia' UNION ALL 
  SELECT 'Superb' UNION ALL SELECT 'Kamiq' UNION ALL SELECT 'Karoq' UNION ALL SELECT 'Kodiaq' UNION ALL
  SELECT 'Enyaq' UNION ALL SELECT 'Rapid' UNION ALL SELECT 'Yeti'
) models
WHERE b.name = 'Skoda'
ON CONFLICT (brand_id, name) DO NOTHING;

-- DACIA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Sandero' as model_name UNION ALL SELECT 'Logan' UNION ALL SELECT 'Duster' UNION ALL SELECT 'Lodgy' UNION ALL 
  SELECT 'Dokker' UNION ALL SELECT 'Spring' UNION ALL SELECT 'Jogger' UNION ALL SELECT '1310'
) models
WHERE b.name = 'Dacia'
ON CONFLICT (brand_id, name) DO NOTHING;

-- DS (anciennement Citroën DS)
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'DS3' as model_name UNION ALL SELECT 'DS4' UNION ALL SELECT 'DS7' UNION ALL SELECT 'DS9' UNION ALL 
  SELECT 'DS3 Crossback' UNION ALL SELECT 'DS4 Crossback'
) models
WHERE b.name = 'DS'
ON CONFLICT (brand_id, name) DO NOTHING;

-- MITSUBISHI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Mirage' as model_name UNION ALL SELECT 'Lancer' UNION ALL SELECT 'Galant' UNION ALL SELECT 'ASX' UNION ALL 
  SELECT 'Outlander' UNION ALL SELECT 'Pajero' UNION ALL SELECT 'L200' UNION ALL SELECT 'Eclipse Cross' UNION ALL
  SELECT 'Outlander PHEV' UNION ALL SELECT 'Evo'
) models
WHERE b.name = 'Mitsubishi'
ON CONFLICT (brand_id, name) DO NOTHING;

-- SUBARU
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Impreza' as model_name UNION ALL SELECT 'Legacy' UNION ALL SELECT 'Outback' UNION ALL SELECT 'Forester' UNION ALL 
  SELECT 'XV' UNION ALL SELECT 'BRZ' UNION ALL SELECT 'WRX' UNION ALL SELECT 'Ascent' UNION ALL SELECT 'Solterra'
) models
WHERE b.name = 'Subaru'
ON CONFLICT (brand_id, name) DO NOTHING;

-- SUZUKI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Alto' as model_name UNION ALL SELECT 'Swift' UNION ALL SELECT 'Baleno' UNION ALL SELECT 'SX4' UNION ALL 
  SELECT 'Vitara' UNION ALL SELECT 'S-Cross' UNION ALL SELECT 'Jimny' UNION ALL SELECT 'Ignis' UNION ALL SELECT 'Celerio'
) models
WHERE b.name = 'Suzuki'
ON CONFLICT (brand_id, name) DO NOTHING;

-- LEXUS
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'CT' as model_name UNION ALL SELECT 'IS' UNION ALL SELECT 'ES' UNION ALL SELECT 'GS' UNION ALL 
  SELECT 'LS' UNION ALL SELECT 'LC' UNION ALL SELECT 'UX' UNION ALL SELECT 'NX' UNION ALL SELECT 'RX' UNION ALL 
  SELECT 'GX' UNION ALL SELECT 'LX' UNION ALL SELECT 'RC' UNION ALL SELECT 'LFA'
) models
WHERE b.name = 'Lexus'
ON CONFLICT (brand_id, name) DO NOTHING;

-- INFINITI
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Q30' as model_name UNION ALL SELECT 'Q50' UNION ALL SELECT 'Q60' UNION ALL SELECT 'Q70' UNION ALL 
  SELECT 'QX30' UNION ALL SELECT 'QX50' UNION ALL SELECT 'QX60' UNION ALL SELECT 'QX70' UNION ALL SELECT 'QX80'
) models
WHERE b.name = 'Infiniti'
ON CONFLICT (brand_id, name) DO NOTHING;

-- ACURA
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'ILX' as model_name UNION ALL SELECT 'TLX' UNION ALL SELECT 'RLX' UNION ALL SELECT 'MDX' UNION ALL 
  SELECT 'RDX' UNION ALL SELECT 'NSX' UNION ALL SELECT 'Integra' UNION ALL SELECT 'ZDX'
) models
WHERE b.name = 'Acura'
ON CONFLICT (brand_id, name) DO NOTHING;

-- GENESIS
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'G70' as model_name UNION ALL SELECT 'G80' UNION ALL SELECT 'G90' UNION ALL SELECT 'GV60' UNION ALL 
  SELECT 'GV70' UNION ALL SELECT 'GV80'
) models
WHERE b.name = 'Genesis'
ON CONFLICT (brand_id, name) DO NOTHING;

-- CADILLAC
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'ATS' as model_name UNION ALL SELECT 'CTS' UNION ALL SELECT 'CT4' UNION ALL SELECT 'CT5' UNION ALL 
  SELECT 'XT4' UNION ALL SELECT 'XT5' UNION ALL SELECT 'XT6' UNION ALL SELECT 'Escalade' UNION ALL 
  SELECT 'Lyriq' UNION ALL SELECT 'Celestiq'
) models
WHERE b.name = 'Cadillac'
ON CONFLICT (brand_id, name) DO NOTHING;

-- LINCOLN
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Corsair' as model_name UNION ALL SELECT 'Nautilus' UNION ALL SELECT 'Aviator' UNION ALL 
  SELECT 'Navigator' UNION ALL SELECT 'Continental' UNION ALL SELECT 'MKZ'
) models
WHERE b.name = 'Lincoln'
ON CONFLICT (brand_id, name) DO NOTHING;

-- BUICK
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Encore' as model_name UNION ALL SELECT 'Envision' UNION ALL SELECT 'Enclave' UNION ALL 
  SELECT 'LaCrosse' UNION ALL SELECT 'Regal'
) models
WHERE b.name = 'Buick'
ON CONFLICT (brand_id, name) DO NOTHING;

-- GMC
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Terrain' as model_name UNION ALL SELECT 'Acadia' UNION ALL SELECT 'Yukon' UNION ALL 
  SELECT 'Sierra' UNION ALL SELECT 'Canyon' UNION ALL SELECT 'Hummer EV'
) models
WHERE b.name = 'GMC'
ON CONFLICT (brand_id, name) DO NOTHING;

-- DODGE
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Charger' as model_name UNION ALL SELECT 'Challenger' UNION ALL SELECT 'Durango' UNION ALL 
  SELECT 'Journey' UNION ALL SELECT 'Grand Caravan' UNION ALL SELECT 'Dart'
) models
WHERE b.name = 'Dodge'
ON CONFLICT (brand_id, name) DO NOTHING;

-- CHRYSLER
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '300' as model_name UNION ALL SELECT 'Pacifica' UNION ALL SELECT 'Voyager' UNION ALL SELECT 'Sebring'
) models
WHERE b.name = 'Chrysler'
ON CONFLICT (brand_id, name) DO NOTHING;

-- JEEP
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT 'Renegade' as model_name UNION ALL SELECT 'Compass' UNION ALL SELECT 'Cherokee' UNION ALL 
  SELECT 'Grand Cherokee' UNION ALL SELECT 'Wrangler' UNION ALL SELECT 'Gladiator' UNION ALL SELECT '4xe'
) models
WHERE b.name = 'Jeep'
ON CONFLICT (brand_id, name) DO NOTHING;

-- RAM
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, model_name
FROM public.car_brands b
CROSS JOIN (
  SELECT '1500' as model_name UNION ALL SELECT '2500' UNION ALL SELECT '3500' UNION ALL 
  SELECT 'ProMaster' UNION ALL SELECT 'ProMaster City'
) models
WHERE b.name = 'Ram'
ON CONFLICT (brand_id, name) DO NOTHING;

-- Ajouter des modèles pour les autres marques
INSERT INTO public.car_models (brand_id, name) 
SELECT b.id, 'Autre modèle'
FROM public.car_brands b
WHERE b.name IN ('BYD', 'Geely', 'Chery', 'Great Wall', 'Haval', 'Lynk & Co', 'Polestar', 'Nio', 'Xpeng', 'Li Auto',
                 'MG', 'Maxus', 'Lada', 'UAZ', 'GAZ', 'Tata', 'Mahindra', 'Holden', 'Proton', 'Perodua',
                 'Bugatti', 'Koenigsegg', 'Pagani', 'McLaren', 'Spyker', 'Rivian', 'Lucid', 'Fisker', 
                 'Canoo', 'Lordstown', 'Autre')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mettre à jour les timestamps
UPDATE public.car_brands SET updated_at = NOW();
UPDATE public.car_models SET updated_at = NOW();

