-- Configurer la table imports pour le realtime
ALTER TABLE public.imports REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.imports;