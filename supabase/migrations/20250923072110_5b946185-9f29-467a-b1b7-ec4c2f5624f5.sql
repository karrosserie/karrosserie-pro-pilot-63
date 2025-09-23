-- Add contact fields to planning_patron table
ALTER TABLE public.planning_patron 
ADD COLUMN nom TEXT,
ADD COLUMN prenom TEXT,
ADD COLUMN mail TEXT,
ADD COLUMN telephone TEXT;