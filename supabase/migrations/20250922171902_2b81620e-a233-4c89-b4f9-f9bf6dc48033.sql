-- Ajouter les contraintes de clé étrangère pour les relations
ALTER TABLE public.bon_commande 
ADD CONSTRAINT bon_commande_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

ALTER TABLE public.bon_commande 
ADD CONSTRAINT bon_commande_quote_id_fkey 
FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE SET NULL;