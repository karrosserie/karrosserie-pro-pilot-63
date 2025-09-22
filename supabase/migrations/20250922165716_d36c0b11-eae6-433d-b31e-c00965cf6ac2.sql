-- Ajouter un champ time à la table planning_patron
ALTER TABLE public.planning_patron 
ADD COLUMN time TIME DEFAULT '09:00:00';