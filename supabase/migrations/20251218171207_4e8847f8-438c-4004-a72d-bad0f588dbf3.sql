-- Ajouter les champs CNI du gérant recto/verso pour les clients entreprise
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS manager_id_front_url text,
ADD COLUMN IF NOT EXISTS manager_id_back_url text;

-- Migrer les données existantes de manager_id_url vers manager_id_front_url
UPDATE public.clients 
SET manager_id_front_url = manager_id_url 
WHERE manager_id_url IS NOT NULL AND manager_id_front_url IS NULL;