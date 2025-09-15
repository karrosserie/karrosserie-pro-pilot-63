-- Corriger la fonction pour gérer correctement les priorités
-- Priority 1 = TRÈS URGENT, Priority 3 = IMPORTANT, Priority 4 = URGENT
CREATE OR REPLACE FUNCTION public.create_urgent_messagerie_alert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  priority_label TEXT;
BEGIN
  -- Vérifier si le message est urgent (priorité <= 4, mais exclure les niveaux non-urgents comme 5+)
  IF NEW.priority <= 4 THEN
    -- Déterminer le niveau de priorité (plus le chiffre est bas, plus c'est urgent)
    IF NEW.priority = 1 THEN
      priority_label := 'TRÈS URGENT';
    ELSIF NEW.priority = 2 THEN
      priority_label := 'URGENT';
    ELSIF NEW.priority = 3 THEN
      priority_label := 'IMPORTANT';
    ELSIF NEW.priority = 4 THEN
      priority_label := 'CRITIQUE';
    ELSE
      priority_label := 'NORMAL';
    END IF;
    
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
    
    RAISE LOG 'Alerte créée automatiquement pour message urgent: % (priorité: %)', NEW.title, NEW.priority;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Supprimer les alertes en double et recréer correctement
DELETE FROM public.system_alerts WHERE entity_type = 'messagerie';

-- Créer les alertes pour tous les messages urgents existants (priority <= 4)
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
    WHEN m.priority = 1 THEN 'TRÈS URGENT'
    WHEN m.priority = 2 THEN 'URGENT'
    WHEN m.priority = 3 THEN 'IMPORTANT'
    WHEN m.priority = 4 THEN 'CRITIQUE'
    ELSE 'NORMAL'
  END,
  'Nouveau message urgent: ' || m.title || ' - ' || m.summary,
  m.channel,
  NULL
FROM public.messageries m
WHERE m.priority <= 4 
  AND m.resolved = false;