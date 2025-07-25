-- Ajouter les champs pour le calcul de la moyenne des temps d'import
ALTER TABLE public.environment 
ADD COLUMN average_timing numeric DEFAULT 0,
ADD COLUMN import_count integer DEFAULT 0;

-- Fonction pour calculer et mettre à jour la moyenne des temps d'import
CREATE OR REPLACE FUNCTION public.update_average_timing()
RETURNS TRIGGER AS $$
DECLARE
    import_duration numeric;
    current_average numeric;
    current_count integer;
    new_average numeric;
BEGIN
    -- Vérifier si le statut est passé à "Importé"
    IF OLD.status != 'Importé' AND NEW.status = 'Importé' THEN
        -- Calculer la durée de l'import en secondes
        import_duration := EXTRACT(EPOCH FROM (NEW.updated_at - NEW.created_at));
        
        -- Récupérer les valeurs actuelles de moyenne et de count
        SELECT average_timing, import_count 
        INTO current_average, current_count
        FROM public.environment 
        LIMIT 1;
        
        -- Si aucune ligne n'existe dans environment, en créer une
        IF NOT FOUND THEN
            INSERT INTO public.environment (average_timing, import_count)
            VALUES (import_duration, 1);
        ELSE
            -- Calculer la nouvelle moyenne
            new_average := ((current_average * current_count) + import_duration) / (current_count + 1);
            
            -- Mettre à jour la moyenne et le compteur
            UPDATE public.environment 
            SET 
                average_timing = new_average,
                import_count = current_count + 1
            WHERE id = (SELECT id FROM public.environment LIMIT 1);
        END IF;
        
        RAISE LOG 'Import duration: % seconds, New average: % seconds', import_duration, new_average;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour mettre à jour automatiquement la moyenne
CREATE TRIGGER update_average_timing_trigger
    AFTER UPDATE ON public.imports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_average_timing();