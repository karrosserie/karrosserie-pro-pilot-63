-- Lier l'utilisateur actuel à l'entreprise qui contient l'encaissement
INSERT INTO public.user_companies (user_id, company_id, role, active)
SELECT 
  auth.uid(),
  '046e1896-846b-4c79-a910-d5ad4e0134e1',
  'Propriétaire',
  true
WHERE auth.uid() IS NOT NULL;