-- Corriger le lien entre la photo d'atelier et le bon véhicule
UPDATE public.vehicle_photos 
SET vehicle_id = '12fed011-ce0b-403f-b860-101c2d2612be' 
WHERE id = 'bcf1e4c1-8062-48f3-bd26-d2807e99f282' 
  AND description LIKE '%Acura MDX 12-hjk-96%';