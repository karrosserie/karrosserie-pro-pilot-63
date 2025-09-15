-- Créer une table pour les alertes de retard d'employés
CREATE TABLE IF NOT EXISTS public.employee_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'retard_pointage',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  clock_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE NULL
);

-- Activer RLS
ALTER TABLE public.employee_alerts ENABLE ROW LEVEL SECURITY;

-- Politique pour que les membres de l'entreprise puissent gérer leurs alertes
CREATE POLICY "Company members can manage employee alerts"
ON public.employee_alerts
FOR ALL
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));