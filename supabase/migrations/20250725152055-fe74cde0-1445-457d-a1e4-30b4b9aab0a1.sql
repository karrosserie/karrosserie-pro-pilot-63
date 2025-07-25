-- Migration pour changer user_id vers company_id dans les tables de données
-- et mettre à jour les politiques RLS

-- 1. Ajouter les colonnes company_id aux tables de données
ALTER TABLE public.bank_accounts ADD COLUMN company_id UUID;
ALTER TABLE public.bridge ADD COLUMN company_id UUID;
ALTER TABLE public.cessions ADD COLUMN company_id UUID;
ALTER TABLE public.clients ADD COLUMN company_id UUID;
ALTER TABLE public.credits ADD COLUMN company_id UUID;
ALTER TABLE public.expenses ADD COLUMN company_id UUID;
ALTER TABLE public.expertise_reports ADD COLUMN company_id UUID;
ALTER TABLE public.fleet_reservations ADD COLUMN company_id UUID;
ALTER TABLE public.fleet_returns ADD COLUMN company_id UUID;
ALTER TABLE public.fleet_vehicles ADD COLUMN company_id UUID;
ALTER TABLE public.generated_reports ADD COLUMN company_id UUID;
ALTER TABLE public.imports ADD COLUMN company_id UUID;
ALTER TABLE public.intervention_sheets ADD COLUMN company_id UUID;
ALTER TABLE public.invoices ADD COLUMN company_id UUID;
ALTER TABLE public.quotes ADD COLUMN company_id UUID;
ALTER TABLE public.receipts ADD COLUMN company_id UUID;
ALTER TABLE public.repair_orders ADD COLUMN company_id UUID;
ALTER TABLE public.tokens ADD COLUMN company_id UUID;
ALTER TABLE public.vehicles ADD COLUMN company_id UUID;

-- 2. Migrer les données existantes (copier company_id depuis user_companies)
UPDATE public.bank_accounts 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = bank_accounts.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.bridge 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = bridge.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.cessions 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = cessions.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.clients 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = clients.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.credits 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = credits.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.expenses 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = expenses.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.expertise_reports 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = expertise_reports.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.fleet_reservations 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = fleet_reservations.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.fleet_returns 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = fleet_returns.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.fleet_vehicles 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = fleet_vehicles.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.generated_reports 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = generated_reports.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.imports 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = imports.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.intervention_sheets 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = intervention_sheets.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.invoices 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = invoices.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.quotes 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = quotes.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.receipts 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = receipts.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.repair_orders 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = repair_orders.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.tokens 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = tokens.user_id 
    AND uc.active = true 
    LIMIT 1
);

UPDATE public.vehicles 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = vehicles.user_id 
    AND uc.active = true 
    LIMIT 1
);

-- 3. Définir company_id comme NOT NULL et supprimer user_id
ALTER TABLE public.bank_accounts ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.bridge ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.cessions ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.clients ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.credits ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.expenses ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.expertise_reports ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.fleet_reservations ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.fleet_returns ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.fleet_vehicles ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.generated_reports ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.imports ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.intervention_sheets ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.invoices ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.quotes ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.receipts ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.repair_orders ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.tokens ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE public.vehicles ALTER COLUMN company_id SET NOT NULL;

-- 4. Supprimer les anciennes colonnes user_id
ALTER TABLE public.bank_accounts DROP COLUMN user_id;
ALTER TABLE public.bridge DROP COLUMN user_id;
ALTER TABLE public.cessions DROP COLUMN user_id;
ALTER TABLE public.clients DROP COLUMN user_id;
ALTER TABLE public.credits DROP COLUMN user_id;
ALTER TABLE public.expenses DROP COLUMN user_id;
ALTER TABLE public.expertise_reports DROP COLUMN user_id;
ALTER TABLE public.fleet_reservations DROP COLUMN user_id;
ALTER TABLE public.fleet_returns DROP COLUMN user_id;
ALTER TABLE public.fleet_vehicles DROP COLUMN user_id;
ALTER TABLE public.generated_reports DROP COLUMN user_id;
ALTER TABLE public.imports DROP COLUMN user_id;
ALTER TABLE public.intervention_sheets DROP COLUMN user_id;
ALTER TABLE public.invoices DROP COLUMN user_id;
ALTER TABLE public.quotes DROP COLUMN user_id;
ALTER TABLE public.receipts DROP COLUMN user_id;
ALTER TABLE public.repair_orders DROP COLUMN user_id;
ALTER TABLE public.tokens DROP COLUMN user_id;
ALTER TABLE public.vehicles DROP COLUMN user_id;

-- 5. Supprimer toutes les anciennes politiques RLS
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

-- 6. Créer les nouvelles politiques RLS basées sur company_id et user_companies

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