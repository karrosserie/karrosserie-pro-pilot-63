-- Désactiver temporairement le trigger auto_decode_vin qui cause des erreurs
-- en raison de l'extension http manquante

-- Supprimer le trigger existant
DROP TRIGGER IF EXISTS auto_decode_vin_trigger ON vehicles;
DROP TRIGGER IF EXISTS auto_decode_vin_trigger ON fleet_vehicles;