-- Corriger la fonction pour éviter les warnings de sécurité
CREATE OR REPLACE FUNCTION public.create_urgent_messagerie_alert()
RETURNS TRIGGER AS $$
DECLARE
  priority_label TEXT;
BEGIN
  -- Vérifier si le message est urgent (priorité >= 3)
  IF NEW.priority >= 3 THEN
    -- Déterminer le niveau de priorité
    IF NEW.priority = 4 THEN
      priority_label := 'CRITICAL';
    ELSIF NEW.priority = 3 THEN
      priority_label := 'IMPORTANT';
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';