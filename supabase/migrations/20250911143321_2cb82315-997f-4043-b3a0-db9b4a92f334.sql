-- Créer le trigger pour envoyer automatiquement la demande de pièces justificatives
-- quand un rapport d'expertise est mis à jour avec un client et un véhicule

CREATE OR REPLACE TRIGGER trigger_auto_create_quote_and_send_documents_request
    AFTER UPDATE ON public.expertise_reports
    FOR EACH ROW
    WHEN (
        -- Se déclenche quand client_id et vehicle_id sont ajoutés
        (OLD.client_id IS NULL AND NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL)
        OR
        (OLD.vehicle_id IS NULL AND NEW.vehicle_id IS NOT NULL AND NEW.client_id IS NOT NULL)
    )
    EXECUTE FUNCTION public.auto_create_quote_from_expertise_report();