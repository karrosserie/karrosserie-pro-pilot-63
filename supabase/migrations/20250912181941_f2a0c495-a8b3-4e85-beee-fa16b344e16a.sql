-- Corriger la politique RLS pour permettre aux propriétaires d'ajouter des employés
DROP POLICY IF EXISTS "Company owners can manage team members" ON public.user_companies;

-- Créer une politique séparée pour l'insertion qui permet aux propriétaires d'ajouter des employés
CREATE POLICY "Company owners can add team members" 
ON public.user_companies 
FOR INSERT 
WITH CHECK (
  user_is_company_owner(auth.uid(), company_id)
);

-- Créer une politique pour les autres opérations (SELECT, UPDATE, DELETE)
CREATE POLICY "Company owners can manage their team members" 
ON public.user_companies 
FOR ALL 
USING (
  user_is_company_owner(auth.uid(), company_id)
);