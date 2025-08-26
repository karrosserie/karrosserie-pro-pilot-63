-- Ajouter les champs pour les réponses clients dans la table client_relances
ALTER TABLE public.client_relances 
ADD COLUMN client_response TEXT,
ADD COLUMN response_read BOOLEAN NOT NULL DEFAULT false;

-- Créer un index sur response_read pour optimiser les requêtes
CREATE INDEX idx_client_relances_response_read ON public.client_relances(response_read);

-- Créer un index composite pour les requêtes sur réponses non lues par compagnie
CREATE INDEX idx_client_relances_unread_responses ON public.client_relances(company_id, response_read) 
WHERE client_response IS NOT NULL;