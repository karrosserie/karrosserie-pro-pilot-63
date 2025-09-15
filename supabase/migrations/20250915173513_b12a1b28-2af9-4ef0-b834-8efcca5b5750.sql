-- Créer une nouvelle table pour les alertes système (employés et véhicules)
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'employee',
  employee_id UUID NULL,
  vehicle_id UUID NULL,
  repair_order_id UUID NULL,
  alert_type TEXT NOT NULL DEFAULT 'retard_pointage',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reason TEXT NULL,
  clock_in_time TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE NULL,
  
  -- Contrainte pour s'assurer qu'au moins une entité est spécifiée
  CONSTRAINT system_alerts_entity_check 
  CHECK (
    (entity_type = 'employee' AND employee_id IS NOT NULL) OR
    (entity_type = 'vehicle' AND vehicle_id IS NOT NULL AND repair_order_id IS NOT NULL)
  )
);

-- Activer RLS
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Créer la politique RLS
CREATE POLICY "Company members can manage system alerts"
ON public.system_alerts
FOR ALL
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Migrer les données existantes de employee_alerts vers system_alerts
INSERT INTO public.system_alerts (
  company_id, entity_type, employee_id, alert_type, title, message, clock_in_time, created_at, resolved, resolved_at
)
SELECT 
  company_id, 'employee', employee_id, alert_type, title, message, clock_in_time, created_at, resolved, resolved_at
FROM public.employee_alerts;

-- Supprimer l'ancienne table employee_alerts
DROP TABLE public.employee_alerts;