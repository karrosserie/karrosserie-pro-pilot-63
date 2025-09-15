-- Ajouter vehicle_id à la table task_photos
ALTER TABLE public.task_photos 
ADD COLUMN vehicle_id uuid;

-- Migrer les données existantes pour lier les photos aux véhicules via les tâches
UPDATE public.task_photos 
SET vehicle_id = es.vehicle_id 
FROM public.employee_schedule es 
WHERE task_photos.task_id = es.id;

-- Ajouter l'index pour améliorer les performances
CREATE INDEX idx_task_photos_vehicle_id ON public.task_photos(vehicle_id);

-- Mettre à jour les contraintes RLS pour inclure vehicle_id
DROP POLICY IF EXISTS "Company members can manage task photos" ON public.task_photos;

CREATE POLICY "Company members can manage task photos" 
ON public.task_photos 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));