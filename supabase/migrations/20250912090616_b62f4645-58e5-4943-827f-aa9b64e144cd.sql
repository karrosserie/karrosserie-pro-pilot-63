-- Ajouter des colonnes pour les photos de début et fin de tâche
ALTER TABLE public.employee_schedule 
ADD COLUMN start_photo_url text,
ADD COLUMN end_photo_url text;

-- Créer un bucket pour les photos de tâches
INSERT INTO storage.buckets (id, name, public) 
VALUES ('employee-tasks', 'employee-tasks', false);

-- Créer des politiques pour les photos de tâches
CREATE POLICY "Employés peuvent uploader leurs photos de tâches" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'employee-tasks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Employés peuvent voir leurs photos de tâches" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'employee-tasks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Membres de l'entreprise peuvent voir les photos de tâches" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'employee-tasks' 
  AND EXISTS (
    SELECT 1 FROM public.employee_schedule es
    WHERE es.user_id::text = (storage.foldername(name))[1]
    AND user_belongs_to_company(auth.uid(), es.company_id)
  )
);