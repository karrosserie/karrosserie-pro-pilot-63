-- Migration des photos de tâches depuis employee_schedule vers task_photos (correction)
-- Étape 1: Insérer les photos start depuis employee_schedule
INSERT INTO public.task_photos (
  task_id,
  employee_id,
  company_id,
  vehicle_id,
  photo_type,
  file_url,
  file_name,
  created_at
)
SELECT 
  es.id::text as task_id,
  es.user_id as employee_id,
  es.company_id,
  es.vehicle_id,
  'start' as photo_type,
  es.start_photo_url as file_url,
  SUBSTRING(es.start_photo_url FROM '[^/]*$') as file_name,
  es.created_at
FROM public.employee_schedule es
WHERE es.start_photo_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.task_photos tp 
    WHERE tp.task_id = es.id::text 
    AND tp.photo_type = 'start'
  );

-- Étape 2: Insérer les photos end depuis employee_schedule
INSERT INTO public.task_photos (
  task_id,
  employee_id,
  company_id,
  vehicle_id,
  photo_type,
  file_url,
  file_name,
  created_at
)
SELECT 
  es.id::text as task_id,
  es.user_id as employee_id,
  es.company_id,
  es.vehicle_id,
  'end' as photo_type,
  es.end_photo_url as file_url,
  SUBSTRING(es.end_photo_url FROM '[^/]*$') as file_name,
  es.updated_at
FROM public.employee_schedule es
WHERE es.end_photo_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.task_photos tp 
    WHERE tp.task_id = es.id::text 
    AND tp.photo_type = 'end'
  );