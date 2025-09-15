-- Modifier la table employee_alerts pour gérer aussi les alertes de véhicules
ALTER TABLE public.employee_alerts RENAME TO public.system_alerts;

-- Ajouter des colonnes pour rendre la table plus générique
ALTER TABLE public.system_alerts 
ADD COLUMN vehicle_id UUID NULL,
ADD COLUMN repair_order_id UUID NULL,
ADD COLUMN entity_type TEXT NOT NULL DEFAULT 'employee',
ADD COLUMN reason TEXT NULL;

-- Modifier la colonne employee_id pour permettre NULL (pour les alertes véhicules)
ALTER TABLE public.system_alerts ALTER COLUMN employee_id DROP NOT NULL;

-- Ajouter une contrainte pour s'assurer qu'au moins une entité est spécifiée
ALTER TABLE public.system_alerts 
ADD CONSTRAINT system_alerts_entity_check 
CHECK (
  (entity_type = 'employee' AND employee_id IS NOT NULL) OR
  (entity_type = 'vehicle' AND vehicle_id IS NOT NULL AND repair_order_id IS NOT NULL)
);

-- Mettre à jour les politiques existantes
DROP POLICY "Company members can manage employee alerts" ON public.system_alerts;

CREATE POLICY "Company members can manage system alerts"
ON public.system_alerts
FOR ALL
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));