-- Créer la table environment
CREATE TABLE public.environment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asynchronous_import BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.environment ENABLE ROW LEVEL SECURITY;

-- Créer les politiques (accès global pour les settings d'environnement)
CREATE POLICY "Allow read access to environment settings" 
ON public.environment 
FOR SELECT 
USING (true);

CREATE POLICY "Allow update access to environment settings" 
ON public.environment 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow insert access to environment settings" 
ON public.environment 
FOR INSERT 
WITH CHECK (true);

-- Créer le trigger pour updated_at
CREATE TRIGGER update_environment_updated_at
BEFORE UPDATE ON public.environment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();