-- Créer les alertes pour les messages urgents existants
INSERT INTO public.system_alerts (
  company_id,
  entity_type,
  employee_id,
  vehicle_id,
  repair_order_id,
  messagerie_id,
  alert_type,
  title,
  message,
  reason,
  clock_in_time
)
SELECT 
  m.company_id,
  'messagerie'::text,
  NULL,
  NULL,
  NULL,
  m.id,
  'messagerie_urgente'::text,
  'Message urgent - ' || CASE 
    WHEN m.priority = 4 THEN 'CRITICAL'
    WHEN m.priority = 3 THEN 'IMPORTANT'
    ELSE 'NORMAL'
  END,
  'Nouveau message urgent: ' || m.title || ' - ' || m.summary,
  m.channel,
  NULL
FROM public.messageries m
WHERE m.priority >= 3 
  AND m.resolved = false
  AND NOT EXISTS (
    SELECT 1 FROM public.system_alerts sa 
    WHERE sa.messagerie_id = m.id
  );

-- S'assurer que le trigger existe et fonctionne
DROP TRIGGER IF EXISTS trigger_create_urgent_messagerie_alert ON public.messageries;

CREATE TRIGGER trigger_create_urgent_messagerie_alert
  AFTER INSERT ON public.messageries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_urgent_messagerie_alert();