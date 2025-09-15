-- Créer une fonction pour générer des alertes pour les véhicules en attente
CREATE OR REPLACE FUNCTION public.create_vehicle_waiting_alert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Vérifier si le statut est passé à "En attente" ou si c'est un nouveau véhicule en attente
  IF NEW.status = 'En attente' AND (OLD IS NULL OR OLD.status != 'En attente') THEN
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
      'vehicle',
      NULL,
      NEW.id,
      NULL, -- Pas de repair_order comme demandé
      NULL,
      'vehicle_waiting',
      'Véhicule en attente',
      'Le véhicule ' || COALESCE(NEW.license_plate, 'Plaque inconnue') || ' est en attente de traitement',
      'En attente',
      NULL
    );
    
    RAISE LOG 'Alerte créée automatiquement pour véhicule en attente: %', NEW.license_plate;
  END IF;
  
  -- Supprimer l'alerte si le véhicule n'est plus en attente
  IF OLD IS NOT NULL AND OLD.status = 'En attente' AND NEW.status != 'En attente' THEN
    UPDATE public.system_alerts 
    SET resolved = true, resolved_at = NOW()
    WHERE vehicle_id = NEW.id 
      AND entity_type = 'vehicle' 
      AND alert_type = 'vehicle_waiting'
      AND resolved = false;
      
    RAISE LOG 'Alerte résolue automatiquement pour véhicule: %', NEW.license_plate;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Créer le trigger pour les véhicules en attente
DROP TRIGGER IF EXISTS trigger_create_vehicle_waiting_alert ON public.vehicles;

CREATE TRIGGER trigger_create_vehicle_waiting_alert
  AFTER INSERT OR UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_vehicle_waiting_alert();

-- Créer les alertes pour tous les véhicules actuellement en attente
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
  v.company_id,
  'vehicle'::text,
  NULL,
  v.id,
  NULL, -- Pas de repair_order comme demandé
  NULL,
  'vehicle_waiting'::text,
  'Véhicule en attente',
  'Le véhicule ' || COALESCE(v.license_plate, 'Plaque inconnue') || ' est en attente de traitement',
  'En attente',
  NULL
FROM public.vehicles v
WHERE v.status = 'En attente'
  AND NOT EXISTS (
    SELECT 1 FROM public.system_alerts sa 
    WHERE sa.vehicle_id = v.id 
      AND sa.entity_type = 'vehicle'
      AND sa.alert_type = 'vehicle_waiting'
      AND sa.resolved = false
  );