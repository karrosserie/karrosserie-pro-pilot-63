-- Simplifier le trigger pour supprimer l'appel HTTP et la création de token
-- Ne garder que la création automatique du devis
CREATE OR REPLACE FUNCTION public.auto_create_quote_from_expertise_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    last_quote_ref text;
    new_reference text;
BEGIN
    -- Vérifier que le rapport a un client et un véhicule
    IF NEW.client_id IS NOT NULL AND NEW.vehicle_id IS NOT NULL THEN
        -- Récupérer la company_id de l'utilisateur actuel ou utiliser celle du rapport
        IF NEW.company_id IS NOT NULL THEN
            -- Générer le numéro de devis (entier auto-incrémenté)
            SELECT reference INTO last_quote_ref
            FROM public.quotes 
            WHERE company_id = NEW.company_id
            ORDER BY reference::integer DESC 
            LIMIT 1;
            
            -- Calculer la nouvelle référence
            IF last_quote_ref IS NOT NULL THEN
                new_reference := (last_quote_ref::integer + 1)::text;
            ELSE
                new_reference := '1';
            END IF;
            
            -- Créer le devis automatiquement (opération rapide)
            INSERT INTO public.quotes (
                reference,
                client_id,
                vehicle_id,
                amount,
                status,
                notes,
                repairs_data,
                parts_data,
                claim_number,
                report_number,
                policy_number,
                report_date,
                expert_name,
                incident_date,
                report_id,
                company_id,
                valid_until,
                created_at,
                updated_at
            ) VALUES (
                new_reference,
                NEW.client_id,
                NEW.vehicle_id,
                COALESCE(NEW.amount, 0),
                'draft',
                '',
                NEW.repairs_data,
                NEW.parts_data,
                NEW.claim_number,
                NEW.report_number,
                NEW.policy_number,
                NEW.report_date,
                NEW.expert_name,
                NEW.incident_date,
                NEW.id,
                NEW.company_id,
                CURRENT_DATE + INTERVAL '30 days',
                NOW(),
                NOW()
            );
            
            RAISE LOG 'Auto-created quote from expertise report: %, quote reference: %', NEW.id, new_reference;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;