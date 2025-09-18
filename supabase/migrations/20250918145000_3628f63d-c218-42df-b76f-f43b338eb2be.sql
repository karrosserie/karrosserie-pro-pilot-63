-- Corriger la contrainte system_alerts pour permettre les alertes de type 'task'
ALTER TABLE public.system_alerts DROP CONSTRAINT system_alerts_entity_check;

-- Recréer la contrainte en incluant le type 'task'
ALTER TABLE public.system_alerts ADD CONSTRAINT system_alerts_entity_check CHECK (
  (
    (entity_type = 'employee' AND employee_id IS NOT NULL AND vehicle_id IS NULL AND repair_order_id IS NULL AND messagerie_id IS NULL) OR
    (entity_type = 'vehicle' AND vehicle_id IS NOT NULL AND employee_id IS NULL AND repair_order_id IS NULL AND messagerie_id IS NULL) OR
    (entity_type = 'messagerie' AND messagerie_id IS NOT NULL AND employee_id IS NULL AND vehicle_id IS NULL AND repair_order_id IS NULL) OR
    (entity_type = 'task' AND employee_id IS NOT NULL AND vehicle_id IS NOT NULL AND repair_order_id IS NULL AND messagerie_id IS NULL)
  )
);