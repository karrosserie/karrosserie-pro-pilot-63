-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  features jsonb NOT NULL DEFAULT '[]',
  tokens_included integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create token packages table
CREATE TABLE public.token_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  token_count integer NOT NULL,
  price numeric NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create company subscriptions table
CREATE TABLE public.company_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  subscription_plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone,
  next_billing_date timestamp with time zone,
  tokens_remaining integer NOT NULL DEFAULT 0,
  tokens_used integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create token usage table to track consumption
CREATE TABLE public.token_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  subscription_id uuid NOT NULL REFERENCES public.company_subscriptions(id),
  operation_type text NOT NULL,
  tokens_consumed integer NOT NULL DEFAULT 1,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_plans (public read)
CREATE POLICY "Allow public read access to subscription plans"
ON public.subscription_plans FOR SELECT USING (is_active = true);

-- RLS policies for token_packages (public read)
CREATE POLICY "Allow public read access to token packages"
ON public.token_packages FOR SELECT USING (is_active = true);

-- RLS policies for company_subscriptions
CREATE POLICY "Company members can view their subscription"
ON public.company_subscriptions FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Company owners can manage subscriptions"
ON public.company_subscriptions FOR ALL
USING (user_is_company_owner(auth.uid(), company_id))
WITH CHECK (user_is_company_owner(auth.uid(), company_id));

-- RLS policies for token_usage
CREATE POLICY "Company members can view token usage"
ON public.token_usage FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Company members can create token usage"
ON public.token_usage FOR INSERT
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price, billing_period, features, tokens_included) VALUES
('Plan Mensuel', 'Abonnement mensuel avec 50 jetons inclus', 49.99, 'monthly', '["Support prioritaire", "Rapports détaillés", "Intégrations avancées"]', 50),
('Plan Annuel', 'Abonnement annuel avec 600 jetons inclus (économisez 2 mois)', 499.99, 'yearly', '["Support prioritaire", "Rapports détaillés", "Intégrations avancées", "10% de remise sur les jetons"]', 600);

-- Insert default token packages
INSERT INTO public.token_packages (name, description, token_count, price) VALUES
('Pack Starter', 'Pack de 25 jetons supplémentaires', 25, 19.99),
('Pack Standard', 'Pack de 50 jetons supplémentaires', 50, 34.99),
('Pack Premium', 'Pack de 100 jetons supplémentaires', 100, 59.99);

-- Add triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_token_packages_updated_at
BEFORE UPDATE ON public.token_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at
BEFORE UPDATE ON public.company_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();