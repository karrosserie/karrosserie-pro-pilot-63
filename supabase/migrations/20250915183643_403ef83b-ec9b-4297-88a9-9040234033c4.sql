-- Créer le trigger pour créer automatiquement les alertes pour les messages urgents
CREATE TRIGGER trigger_create_urgent_messagerie_alert
  AFTER INSERT ON public.messageries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_urgent_messagerie_alert();