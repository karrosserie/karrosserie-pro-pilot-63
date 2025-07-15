-- Modifier la structure des vehicle_images pour stocker des objets avec URL et timing
-- Les images existantes seront converties automatiquement

-- Fonction pour migrer les données existantes
CREATE OR REPLACE FUNCTION migrate_vehicle_images()
RETURNS void AS $$
DECLARE
    vehicle_record RECORD;
    image_url TEXT;
    new_images JSONB := '[]'::jsonb;
    image_object JSONB;
BEGIN
    -- Parcourir tous les véhicules qui ont des images
    FOR vehicle_record IN 
        SELECT id, vehicle_images 
        FROM vehicles 
        WHERE vehicle_images IS NOT NULL AND vehicle_images != 'null'::jsonb
    LOOP
        new_images := '[]'::jsonb;
        
        -- Parcourir chaque image existante dans le tableau
        FOR image_url IN 
            SELECT jsonb_array_elements_text(vehicle_record.vehicle_images)
        LOOP
            -- Ignorer les entrées vides
            IF image_url != '' THEN
                -- Créer un objet avec l'URL et un timing par défaut
                image_object := jsonb_build_object(
                    'url', image_url,
                    'timing', 'Avant'
                );
                
                -- Ajouter l'objet au nouveau tableau
                new_images := new_images || image_object;
            END IF;
        END LOOP;
        
        -- Mettre à jour le véhicule avec la nouvelle structure
        UPDATE vehicles 
        SET vehicle_images = new_images 
        WHERE id = vehicle_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration
SELECT migrate_vehicle_images();

-- Supprimer la fonction temporaire
DROP FUNCTION migrate_vehicle_images();