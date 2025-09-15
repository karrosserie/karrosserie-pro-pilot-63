-- Modifier la fonction pour ne créer des alertes que pour les messages TRÈS URGENTS (priority 1)
CREATE OR REPLACE FUNCTION public.create_urgent_messagerie_alert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  priority_label TEXT;
BEGIN
  -- Vérifier si le message est TRÈS URGENT (priority = 1 uniquement)
  IF NEW.priority = 1 THEN
    priority_label := 'TRÈS URGENT';
    
    -- Créer l'alerte automatiquement
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
    ) VALUES (
      NEW.company_id,
      'messagerie',
      NULL,
      NULL,
      NULL,
      NEW.id,
      'messagerie_urgente',
      'Message urgent - ' || priority_label,
      'Nouveau message urgent: ' || NEW.title || ' - ' || NEW.summary,
      NEW.channel,
      NULL
    );
    
    RAISE LOG 'Alerte créée automatiquement pour message très urgent: % (priorité: %)', NEW.title, NEW.priority;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Supprimer toutes les alertes messagerie existantes
DELETE FROM public.system_alerts WHERE entity_type = 'messagerie';

-- Créer les alertes uniquement pour les messages TRÈS URGENTS (priority = 1)
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
  'Message urgent - TRÈS URGENT',
  'Nouveau message urgent: ' || m.title || ' - ' || m.summary,
  m.channel,
  NULL
FROM public.messageries m
WHERE m.priority = 1 
  AND m.resolved = false;