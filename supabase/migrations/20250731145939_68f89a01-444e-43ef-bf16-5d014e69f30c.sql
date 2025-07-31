-- Créer la table employees pour la gestion des employés du planning
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  team_member_id UUID REFERENCES public.user_companies(id) ON DELETE SET NULL,
  qualifications JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT employees_company_team_unique UNIQUE(company_id, team_member_id)
);

-- Activer RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour les employés
CREATE POLICY "Company members can manage employees"
ON public.employees
FOR ALL
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les performances
CREATE INDEX idx_employees_company_id ON public.employees(company_id);
CREATE INDEX idx_employees_team_member_id ON public.employees(team_member_id);