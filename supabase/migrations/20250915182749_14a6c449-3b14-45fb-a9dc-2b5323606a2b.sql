-- Étendre le système d'alertes pour supporter les messageries urgentes
-- D'abord, modifier la contrainte pour permettre les alertes de type 'messagerie'
ALTER TABLE public.system_alerts 
DROP CONSTRAINT IF EXISTS system_alerts_entity_check;

-- Ajouter une colonne pour référencer les messageries
ALTER TABLE public.system_alerts 
ADD COLUMN IF NOT EXISTS messagerie_id UUID REFERENCES public.messageries(id);

-- Recréer la contrainte avec support des messageries urgentes
ALTER TABLE public.system_alerts 
ADD CONSTRAINT system_alerts_entity_check CHECK (
  (
    (entity_type = 'employee' AND employee_id IS NOT NULL) OR
    (entity_type = 'vehicle' AND vehicle_id IS NOT NULL AND repair_order_id IS NOT NULL) OR
    (entity_type = 'messagerie' AND messagerie_id IS NOT NULL)
  )
);

-- Ajouter un nouveau type d'alerte pour les messageries urgentes
-- Pas besoin de modifier alert_type car c'est un text, on utilisera 'messagerie_urgente'

-- Créer une fonction pour générer automatiquement des alertes pour les messageries urgentes
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger qui se déclenche lors de l'insertion de nouveaux messages
DROP TRIGGER IF EXISTS trigger_create_urgent_messagerie_alert ON public.messageries;
CREATE TRIGGER trigger_create_urgent_messagerie_alert
  AFTER INSERT ON public.messageries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_urgent_messagerie_alert();

-- Index pour améliorer les performances sur les requêtes d'alertes
CREATE INDEX IF NOT EXISTS idx_system_alerts_messagerie_id ON public.system_alerts(messagerie_id) WHERE messagerie_id IS NOT NULL;