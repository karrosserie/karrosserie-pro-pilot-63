-- Associer l'utilisateur actuel à l'entreprise du dossier fictif
INSERT INTO public.user_companies (user_id, company_id, role, active)
SELECT 
    auth.uid(),
    '046e1896-846b-4c79-a910-d5ad4e0134e1',
    'Propriétaire',
    true
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, company_id) DO UPDATE SET 
    active = true,
    role = 'Propriétaire';