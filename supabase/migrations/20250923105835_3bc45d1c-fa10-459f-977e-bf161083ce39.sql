-- Ajouter une colonne pour stocker les instructions détaillées provenant de N8N
ALTER TABLE public.employee_schedule 
ADD COLUMN detailed_instructions JSONB DEFAULT NULL;

-- Créer un index pour améliorer les performances des requêtes sur les instructions
CREATE INDEX idx_employee_schedule_detailed_instructions 
ON public.employee_schedule USING GIN (detailed_instructions);

-- Ajouter un commentaire pour documenter l'utilisation
COMMENT ON COLUMN public.employee_schedule.detailed_instructions IS 'Instructions détaillées reçues de N8N pour la tâche, format JSON avec array d instructions numérotées';