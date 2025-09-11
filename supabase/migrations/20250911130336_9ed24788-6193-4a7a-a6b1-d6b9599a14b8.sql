-- Ajouter une colonne pour stocker l'URL du document signé
ALTER TABLE public.cessions 
ADD COLUMN signed_document_url TEXT;