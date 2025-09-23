-- Activer la réplication complète pour la table employee_schedule pour le realtime
ALTER TABLE public.employee_schedule REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime pour les mises à jour en temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_schedule;