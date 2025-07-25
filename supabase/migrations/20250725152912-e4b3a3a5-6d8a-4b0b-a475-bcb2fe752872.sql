-- 3. Finaliser la migration : définir company_id comme NOT NULL et supprimer user_id

-- Définir company_id comme NOT NULL
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
ALTER TABLE public.vehicles ALTER COLUMN company_id SET NOT NULL;

-- Note: tokens a déjà company_id, donc on ne modifie que s'il n'est pas déjà NOT NULL
DO $$
BEGIN
    -- Vérifier si tokens.company_id peut être NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tokens' 
        AND column_name = 'company_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.tokens ALTER COLUMN company_id SET NOT NULL;
    END IF;
END
$$;

-- Supprimer les anciennes colonnes user_id
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