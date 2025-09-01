-- Créer les policies RLS pour la table receipts si elles n'existent pas
-- Permettre aux membres de l'entreprise de voir et gérer leurs encaissements

-- Créer la policy de lecture
CREATE POLICY IF NOT EXISTS "Company members can view receipts" 
ON public.receipts 
FOR SELECT 
USING (user_belongs_to_company(auth.uid(), company_id));

-- Créer la policy d'insertion
CREATE POLICY IF NOT EXISTS "Company members can create receipts" 
ON public.receipts 
FOR INSERT 
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Créer la policy de mise à jour
CREATE POLICY IF NOT EXISTS "Company members can update receipts" 
ON public.receipts 
FOR UPDATE 
USING (user_belongs_to_company(auth.uid(), company_id));

-- Créer la policy de suppression
CREATE POLICY IF NOT EXISTS "Company members can delete receipts" 
ON public.receipts 
FOR DELETE 
USING (user_belongs_to_company(auth.uid(), company_id));

-- S'assurer que RLS est activé sur la table
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;