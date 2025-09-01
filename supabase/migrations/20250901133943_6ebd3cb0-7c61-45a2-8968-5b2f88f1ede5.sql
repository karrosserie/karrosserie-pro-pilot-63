-- Mettre à jour le dossier fictif avec la bonne company_id de l'utilisateur
UPDATE public.judicial_cases 
SET company_id = '7a6094d4-20e9-4dee-a965-31b443441262'
WHERE reference = 'FAC-2024-002';

-- Mettre à jour aussi le client et la facture si ils existent
UPDATE public.clients 
SET company_id = '7a6094d4-20e9-4dee-a965-31b443441262'
WHERE last_name = 'Martin' AND first_name = 'Jean-Pierre';

UPDATE public.invoices 
SET company_id = '7a6094d4-20e9-4dee-a965-31b443441262'
WHERE reference = 'FAC-2024-002';