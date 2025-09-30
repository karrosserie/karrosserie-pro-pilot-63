-- Ajouter la colonne waiting_reason à la table vehicles pour stocker la raison d'attente

ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS waiting_reason TEXT;