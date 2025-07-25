-- Migration sélective pour changer user_id vers company_id 
-- en vérifiant les colonnes existantes

-- 1. Ajouter les colonnes company_id uniquement si elles n'existent pas
DO $$
BEGIN
    -- bank_accounts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bank_accounts' AND column_name='company_id') THEN
        ALTER TABLE public.bank_accounts ADD COLUMN company_id UUID;
    END IF;
    
    -- bridge
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bridge' AND column_name='company_id') THEN
        ALTER TABLE public.bridge ADD COLUMN company_id UUID;
    END IF;
    
    -- cessions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cessions' AND column_name='company_id') THEN
        ALTER TABLE public.cessions ADD COLUMN company_id UUID;
    END IF;
    
    -- clients
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='company_id') THEN
        ALTER TABLE public.clients ADD COLUMN company_id UUID;
    END IF;
    
    -- credits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credits' AND column_name='company_id') THEN
        ALTER TABLE public.credits ADD COLUMN company_id UUID;
    END IF;
    
    -- expenses
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='company_id') THEN
        ALTER TABLE public.expenses ADD COLUMN company_id UUID;
    END IF;
    
    -- expertise_reports
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expertise_reports' AND column_name='company_id') THEN
        ALTER TABLE public.expertise_reports ADD COLUMN company_id UUID;
    END IF;
    
    -- fleet_reservations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fleet_reservations' AND column_name='company_id') THEN
        ALTER TABLE public.fleet_reservations ADD COLUMN company_id UUID;
    END IF;
    
    -- fleet_returns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fleet_returns' AND column_name='company_id') THEN
        ALTER TABLE public.fleet_returns ADD COLUMN company_id UUID;
    END IF;
    
    -- fleet_vehicles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fleet_vehicles' AND column_name='company_id') THEN
        ALTER TABLE public.fleet_vehicles ADD COLUMN company_id UUID;
    END IF;
    
    -- generated_reports
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='generated_reports' AND column_name='company_id') THEN
        ALTER TABLE public.generated_reports ADD COLUMN company_id UUID;
    END IF;
    
    -- imports
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='imports' AND column_name='company_id') THEN
        ALTER TABLE public.imports ADD COLUMN company_id UUID;
    END IF;
    
    -- intervention_sheets
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intervention_sheets' AND column_name='company_id') THEN
        ALTER TABLE public.intervention_sheets ADD COLUMN company_id UUID;
    END IF;
    
    -- invoices
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='company_id') THEN
        ALTER TABLE public.invoices ADD COLUMN company_id UUID;
    END IF;
    
    -- quotes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='company_id') THEN
        ALTER TABLE public.quotes ADD COLUMN company_id UUID;
    END IF;
    
    -- receipts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='receipts' AND column_name='company_id') THEN
        ALTER TABLE public.receipts ADD COLUMN company_id UUID;
    END IF;
    
    -- repair_orders
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='repair_orders' AND column_name='company_id') THEN
        ALTER TABLE public.repair_orders ADD COLUMN company_id UUID;
    END IF;
    
    -- vehicles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicles' AND column_name='company_id') THEN
        ALTER TABLE public.vehicles ADD COLUMN company_id UUID;
    END IF;
END
$$;

-- 2. Migrer les données pour les tables qui ont user_id
UPDATE public.bank_accounts 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = bank_accounts.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.bridge 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = bridge.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.cessions 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = cessions.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.clients 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = clients.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.credits 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = credits.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.expenses 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = expenses.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.expertise_reports 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = expertise_reports.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.fleet_reservations 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = fleet_reservations.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.fleet_returns 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = fleet_returns.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.fleet_vehicles 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = fleet_vehicles.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.generated_reports 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = generated_reports.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.imports 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = imports.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.intervention_sheets 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = intervention_sheets.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.invoices 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = invoices.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.quotes 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = quotes.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.receipts 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = receipts.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.repair_orders 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = repair_orders.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

UPDATE public.vehicles 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = vehicles.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;

-- Pour tokens, mettre à jour seulement si company_id est null
UPDATE public.tokens 
SET company_id = (
    SELECT uc.company_id 
    FROM public.user_companies uc 
    WHERE uc.user_id = tokens.user_id 
    AND uc.active = true 
    LIMIT 1
)
WHERE company_id IS NULL AND user_id IS NOT NULL;