-- Activer la réplication complète pour la table employee_schedule pour le realtime
ALTER TABLE public.employee_schedule REPLICA IDENTITY FULL;