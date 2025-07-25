-- Activer l'extension http pour permettre les appels HTTP
CREATE EXTENSION IF NOT EXISTS http;

-- Recréer le trigger pour le décodage automatique VIN sur les véhicules
CREATE TRIGGER auto_decode_vin_trigger
    BEFORE INSERT OR UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_decode_vin();

-- Recréer le trigger pour le décodage automatique VIN sur les véhicules de flotte
CREATE TRIGGER auto_decode_vin_trigger
    BEFORE INSERT OR UPDATE ON public.fleet_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_decode_vin();