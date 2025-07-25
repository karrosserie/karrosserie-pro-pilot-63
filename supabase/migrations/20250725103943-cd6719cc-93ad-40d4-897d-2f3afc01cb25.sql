-- Fonction pour décoder automatiquement le VIN et compléter les champs manquants
CREATE OR REPLACE FUNCTION public.auto_decode_vin()
RETURNS TRIGGER AS $$
DECLARE
    vin_data jsonb;
    decoded_brand_name text;
    brand_record record;
    model_record record;
BEGIN
    -- Vérifier si le VIN existe et si des champs sont manquants
    IF NEW.vin IS NOT NULL AND NEW.vin != '' AND (
        NEW.brand_id IS NULL OR 
        NEW.model_id IS NULL OR 
        NEW.year IS NULL
    ) THEN
        -- Appeler l'edge function vin-decoder
        SELECT content INTO vin_data
        FROM http((
            'POST',
            'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/vin-decoder',
            ARRAY[
                http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)),
                http_header('Content-Type', 'application/json')
            ],
            'application/json',
            json_build_object('vin', NEW.vin)::text
        ));

        -- Vérifier si la réponse est valide
        IF vin_data IS NOT NULL AND vin_data->>'success' = 'true' THEN
            -- Compléter brand_id si manquant
            IF NEW.brand_id IS NULL AND vin_data->'data'->>'brand' IS NOT NULL THEN
                decoded_brand_name := vin_data->'data'->>'brand';
                
                -- Chercher la marque correspondante
                SELECT * INTO brand_record
                FROM car_brands 
                WHERE LOWER(name) = LOWER(decoded_brand_name)
                LIMIT 1;
                
                IF brand_record.id IS NOT NULL THEN
                    NEW.brand_id := brand_record.id;
                END IF;
            END IF;

            -- Compléter model_id si manquant et brand_id est disponible
            IF NEW.model_id IS NULL AND NEW.brand_id IS NOT NULL AND vin_data->'data'->>'model' IS NOT NULL THEN
                -- Chercher le modèle correspondant
                SELECT * INTO model_record
                FROM car_models 
                WHERE brand_id = NEW.brand_id 
                AND LOWER(name) = LOWER(vin_data->'data'->>'model')
                LIMIT 1;
                
                IF model_record.id IS NOT NULL THEN
                    NEW.model_id := model_record.id;
                END IF;
            END IF;

            -- Compléter year si manquant
            IF NEW.year IS NULL AND vin_data->'data'->>'year' IS NOT NULL THEN
                NEW.year := (vin_data->'data'->>'year')::integer;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour les INSERT et UPDATE
CREATE OR REPLACE TRIGGER trigger_auto_decode_vin
    BEFORE INSERT OR UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_decode_vin();