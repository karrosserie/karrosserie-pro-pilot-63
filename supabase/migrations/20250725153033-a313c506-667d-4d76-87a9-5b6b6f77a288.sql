-- 4. Supprimer toutes les anciennes politiques RLS qui dépendent de user_id
DROP POLICY IF EXISTS "Users can delete their own bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can insert their own bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can update their own bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can view their own bank accounts" ON public.bank_accounts;

DROP POLICY IF EXISTS "Users can delete their own bridge data" ON public.bridge;
DROP POLICY IF EXISTS "Users can insert their own bridge data" ON public.bridge;
DROP POLICY IF EXISTS "Users can update their own bridge data" ON public.bridge;
DROP POLICY IF EXISTS "Users can view their own bridge data" ON public.bridge;

DROP POLICY IF EXISTS "Users can delete their own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can insert their own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can manage own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can update their own cessions" ON public.cessions;
DROP POLICY IF EXISTS "Users can view their own cessions" ON public.cessions;

DROP POLICY IF EXISTS "Users can manage own clients" ON public.clients;

DROP POLICY IF EXISTS "Users can manage own credits" ON public.credits;

DROP POLICY IF EXISTS "Users can manage own expenses" ON public.expenses;

DROP POLICY IF EXISTS "Users can manage own expertise reports" ON public.expertise_reports;

DROP POLICY IF EXISTS "Users can manage own fleet reservations" ON public.fleet_reservations;

DROP POLICY IF EXISTS "Users can manage own fleet returns" ON public.fleet_returns;

DROP POLICY IF EXISTS "Users can delete their own fleet vehicles" ON public.fleet_vehicles;
DROP POLICY IF EXISTS "Users can insert their own fleet vehicles" ON public.fleet_vehicles;
DROP POLICY IF EXISTS "Users can manage own fleet vehicles" ON public.fleet_vehicles;
DROP POLICY IF EXISTS "Users can update their own fleet vehicles" ON public.fleet_vehicles;
DROP POLICY IF EXISTS "Users can view their own fleet vehicles" ON public.fleet_vehicles;

DROP POLICY IF EXISTS "Users can create their own generated reports" ON public.generated_reports;
DROP POLICY IF EXISTS "Users can delete their own generated reports" ON public.generated_reports;
DROP POLICY IF EXISTS "Users can update their own generated reports" ON public.generated_reports;
DROP POLICY IF EXISTS "Users can view their own generated reports" ON public.generated_reports;

DROP POLICY IF EXISTS "Users can delete their own imports" ON public.imports;
DROP POLICY IF EXISTS "Users can insert their own imports" ON public.imports;
DROP POLICY IF EXISTS "Users can update their own imports" ON public.imports;
DROP POLICY IF EXISTS "Users can view their own imports" ON public.imports;

DROP POLICY IF EXISTS "Users can create their own intervention sheets" ON public.intervention_sheets;
DROP POLICY IF EXISTS "Users can delete their own intervention sheets" ON public.intervention_sheets;
DROP POLICY IF EXISTS "Users can update their own intervention sheets" ON public.intervention_sheets;
DROP POLICY IF EXISTS "Users can view their own intervention sheets" ON public.intervention_sheets;

DROP POLICY IF EXISTS "Users can manage own invoices" ON public.invoices;

DROP POLICY IF EXISTS "Users can manage own quotes" ON public.quotes;

DROP POLICY IF EXISTS "Users can manage own receipts" ON public.receipts;

DROP POLICY IF EXISTS "Users can manage own repair orders" ON public.repair_orders;

DROP POLICY IF EXISTS "Users can manage own tokens" ON public.tokens;

DROP POLICY IF EXISTS "Users can manage own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can manage their own vehicles" ON public.vehicles;

-- Maintenant supprimer les colonnes user_id
ALTER TABLE public.bank_accounts DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.bridge DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.cessions DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.clients DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.credits DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.expenses DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.expertise_reports DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.fleet_reservations DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.fleet_returns DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.fleet_vehicles DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.generated_reports DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.imports DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.intervention_sheets DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.receipts DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.repair_orders DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.tokens DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.vehicles DROP COLUMN IF EXISTS user_id;

-- 5. Créer les nouvelles politiques RLS basées sur company_id

-- bank_accounts
CREATE POLICY "Company members can manage bank accounts" ON public.bank_accounts
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- bridge
CREATE POLICY "Company members can manage bridge data" ON public.bridge
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- cessions
CREATE POLICY "Company members can manage cessions" ON public.cessions
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- clients
CREATE POLICY "Company members can manage clients" ON public.clients
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- credits
CREATE POLICY "Company members can manage credits" ON public.credits
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- expenses
CREATE POLICY "Company members can manage expenses" ON public.expenses
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- expertise_reports
CREATE POLICY "Company members can manage expertise reports" ON public.expertise_reports
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- fleet_reservations
CREATE POLICY "Company members can manage fleet reservations" ON public.fleet_reservations
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- fleet_returns
CREATE POLICY "Company members can manage fleet returns" ON public.fleet_returns
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- fleet_vehicles
CREATE POLICY "Company members can manage fleet vehicles" ON public.fleet_vehicles
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- generated_reports
CREATE POLICY "Company members can manage generated reports" ON public.generated_reports
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- imports
CREATE POLICY "Company members can manage imports" ON public.imports
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- intervention_sheets
CREATE POLICY "Company members can manage intervention sheets" ON public.intervention_sheets
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- invoices
CREATE POLICY "Company members can manage invoices" ON public.invoices
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- quotes
CREATE POLICY "Company members can manage quotes" ON public.quotes
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- receipts
CREATE POLICY "Company members can manage receipts" ON public.receipts
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- repair_orders
CREATE POLICY "Company members can manage repair orders" ON public.repair_orders
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- tokens
CREATE POLICY "Company members can manage tokens" ON public.tokens
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- vehicles
CREATE POLICY "Company members can manage vehicles" ON public.vehicles
FOR ALL USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));