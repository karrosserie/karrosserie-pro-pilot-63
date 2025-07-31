-- Supprimer l'ancienne politique RLS sur la table bridge
DROP POLICY IF EXISTS "Company members can manage bridge data" ON public.bridge;

-- Créer une nouvelle politique RLS qui utilise les comptes bancaires comme référence
CREATE POLICY "Company members can manage bridge data through bank accounts" 
ON public.bridge 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.bank_accounts ba 
    WHERE ba.id = bridge.account_id 
    AND user_belongs_to_company(auth.uid(), ba.company_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bank_accounts ba 
    WHERE ba.id = bridge.account_id 
    AND user_belongs_to_company(auth.uid(), ba.company_id)
  )
);