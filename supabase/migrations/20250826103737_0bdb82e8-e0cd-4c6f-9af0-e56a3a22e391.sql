-- Modifier la valeur par défaut du champ ai_relance_enabled pour qu'il soit désactivé par défaut
ALTER TABLE public.company_preferences 
ALTER COLUMN ai_relance_enabled SET DEFAULT false;