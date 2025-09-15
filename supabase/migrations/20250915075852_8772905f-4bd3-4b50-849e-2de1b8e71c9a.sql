-- Ajouter la colonne waiting_reason à la table employee_schedule
ALTER TABLE public.employee_schedule 
ADD COLUMN waiting_reason TEXT NULL;