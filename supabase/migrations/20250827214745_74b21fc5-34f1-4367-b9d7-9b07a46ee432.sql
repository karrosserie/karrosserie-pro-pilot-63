-- Corriger le système d'impersonation : autoriser les admins à accéder à toutes les données
-- et gérer le filtrage côté client plutôt que côté serveur

-- 1. Modifier les politiques pour permettre aux admins de voir toutes les données de toutes les companies
DROP POLICY IF EXISTS "Company members can manage clients" ON public.clients;

CREATE POLICY "Company members can manage clients" 
ON public.clients 
FOR ALL 
USING (
  -- Les utilisateurs normaux accèdent à leurs propres données
  user_belongs_to_company(auth.uid(), company_id) OR
  -- Les admins ont accès à toutes les données pour l'impersonation
  get_current_user_role() = 'admin'
)
WITH CHECK (
  -- Pour l'insertion/mise à jour, même règle
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
);

-- 2. Invoices
DROP POLICY IF EXISTS "Company members can manage invoices" ON public.invoices;

CREATE POLICY "Company members can manage invoices" 
ON public.invoices 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
);

-- 3. Receipts
DROP POLICY IF EXISTS "Company members can manage receipts" ON public.receipts;

CREATE POLICY "Company members can manage receipts" 
ON public.receipts 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
);

-- 4. Quotes
DROP POLICY IF EXISTS "Company members can manage quotes" ON public.quotes;

CREATE POLICY "Company members can manage quotes" 
ON public.quotes 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
);

-- 5. Bank Accounts
DROP POLICY IF EXISTS "Company members can manage bank accounts" ON public.bank_accounts;

CREATE POLICY "Company members can manage bank accounts" 
ON public.bank_accounts 
FOR ALL 
USING (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) OR
  get_current_user_role() = 'admin'
);

-- 6. Vehicles (si la table existe)
DROP POLICY IF EXISTS "Company members can manage vehicles" ON public.vehicles;

-- Only create if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vehicles') THEN
        EXECUTE 'CREATE POLICY "Company members can manage vehicles" 
        ON public.vehicles 
        FOR ALL 
        USING (
          user_belongs_to_company(auth.uid(), company_id) OR
          get_current_user_role() = ''admin''
        )
        WITH CHECK (
          user_belongs_to_company(auth.uid(), company_id) OR
          get_current_user_role() = ''admin''
        );';
    END IF;
END
$$;