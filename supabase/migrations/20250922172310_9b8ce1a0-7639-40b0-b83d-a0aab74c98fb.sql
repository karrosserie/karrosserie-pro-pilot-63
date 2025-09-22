-- Ajouter les champs pour le fichier uploadé dans bon_livraison
ALTER TABLE public.bon_livraison 
ADD COLUMN file_url TEXT,
ADD COLUMN file_name TEXT,
ADD COLUMN file_type TEXT;