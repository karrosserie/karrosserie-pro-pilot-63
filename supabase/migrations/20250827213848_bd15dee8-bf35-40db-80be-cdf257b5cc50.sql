-- Corriger les politiques RLS pour l'impersonation

-- 1. Clients - Mettre à jour la politique pour tenir compte de l'impersonation
DROP POLICY IF EXISTS "Company members can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Admin users can manage all clients" ON public.clients;

CREATE POLICY "Company members can manage clients" 
ON public.clients 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 2. Invoices - Mettre à jour la politique pour tenir compte de l'impersonation
DROP POLICY IF EXISTS "Company members can manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admin users can manage all invoices" ON public.invoices;

CREATE POLICY "Company members can manage invoices" 
ON public.invoices 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 3. Receipts - Mettre à jour la politique pour tenir compte de l'impersonation
DROP POLICY IF EXISTS "Company members can manage receipts" ON public.receipts;

CREATE POLICY "Company members can manage receipts" 
ON public.receipts 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 4. Quotes - Mettre à jour la politique pour tenir compte de l'impersonation
DROP POLICY IF EXISTS "Company members can manage quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admin users can manage all quotes" ON public.quotes;

CREATE POLICY "Company members can manage quotes" 
ON public.quotes 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 5. Vehicles - Ajouter les politiques pour les véhicules
DROP POLICY IF EXISTS "Company members can manage vehicles" ON public.vehicles;

CREATE POLICY "Company members can manage vehicles" 
ON public.vehicles 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 6. Bank Accounts - Mettre à jour la politique pour tenir compte de l'impersonation
DROP POLICY IF EXISTS "Company members can manage bank accounts" ON public.bank_accounts;

CREATE POLICY "Company members can manage bank accounts" 
ON public.bank_accounts 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 7. Company Info - Mettre à jour les politiques pour l'impersonation
DROP POLICY IF EXISTS "Admin users can view all company info" ON public.company_info;
DROP POLICY IF EXISTS "Users can view company info if they belong to company" ON public.company_info;

CREATE POLICY "Users can view company info if they belong to company" 
ON public.company_info 
FOR SELECT 
USING (
  EXISTS ( SELECT 1
   FROM user_companies uc
  WHERE ((uc.company_id = company_info.id) AND (uc.user_id = auth.uid()) AND (uc.active = true))) OR
  (company_info.id = public.get_effective_company_id())
);

-- 8. Company Preferences - Mettre à jour les politiques pour l'impersonation
DROP POLICY IF EXISTS "Users can view company preferences if they belong to company" ON public.company_preferences;
DROP POLICY IF EXISTS "Users can update company preferences if they belong to company" ON public.company_preferences;
DROP POLICY IF EXISTS "Users can insert company preferences if they belong to company" ON public.company_preferences;
DROP POLICY IF EXISTS "Users can delete company preferences if they belong to company" ON public.company_preferences;

CREATE POLICY "Users can view company preferences if they belong to company" 
ON public.company_preferences 
FOR SELECT 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

CREATE POLICY "Users can update company preferences if they belong to company" 
ON public.company_preferences 
FOR UPDATE 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

CREATE POLICY "Users can insert company preferences if they belong to company" 
ON public.company_preferences 
FOR INSERT 
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

CREATE POLICY "Users can delete company preferences if they belong to company" 
ON public.company_preferences 
FOR DELETE 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);

-- 9. Company Subscriptions - Mettre à jour les politiques pour l'impersonation
DROP POLICY IF EXISTS "Admin users can view all company subscriptions" ON public.company_subscriptions;
DROP POLICY IF EXISTS "Company members can view their subscription" ON public.company_subscriptions;

CREATE POLICY "Company members can view their subscription" 
ON public.company_subscriptions 
FOR SELECT 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  (company_id = public.get_effective_company_id())
);