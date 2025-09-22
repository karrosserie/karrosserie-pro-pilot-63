-- Créer la table planning_patron pour stocker les tâches du propriétaire
CREATE TABLE public.planning_patron (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  duration NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.planning_patron ENABLE ROW LEVEL SECURITY;

-- Politique pour que les membres de l'entreprise puissent gérer les tâches du planning patron
CREATE POLICY "Company members can manage planning patron tasks"
ON public.planning_patron
FOR ALL
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_planning_patron_updated_at
BEFORE UPDATE ON public.planning_patron
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();