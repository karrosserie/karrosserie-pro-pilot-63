-- Corriger l'appel à l'edge function avec les headers appropriés
CREATE OR REPLACE FUNCTION public.auto_create_quote_from_expertise_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    last_quote_ref text;
    new_reference text;
    token_id uuid;
    client_email text;
    client_phone text;
    http_response http_response;
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
            
            -- Créer le devis automatiquement
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
            
            -- Récupérer l'email et le téléphone du client
            SELECT email, phone INTO client_email, client_phone
            FROM public.clients
            WHERE id = NEW.client_id;
            
            -- Si le client a un email ou un téléphone, créer un token pour la demande de justificatifs
            IF (client_email IS NOT NULL AND client_email != '') OR (client_phone IS NOT NULL AND client_phone != '') THEN
                -- Créer un token pour la demande de justificatifs
                INSERT INTO public.tokens (
                    company_id,
                    client_id,
                    vehicule_id,
                    created_at,
                    updated_at
                ) VALUES (
                    NEW.company_id,
                    NEW.client_id,
                    NEW.vehicle_id,
                    NOW(),
                    NOW()
                ) RETURNING id INTO token_id;
                
                -- Appeler l'edge function process-documents-request avec headers appropriés
                SELECT * INTO http_response FROM http((
                    'POST',
                    'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/process-documents-request',
                    ARRAY[
                        http_header('Content-Type', 'application/json')
                    ],
                    'application/json',
                    jsonb_build_object('tokenId', token_id::text)::text
                ));
                
                RAISE LOG 'Auto-created quote and token for expertise report: %, token: %, HTTP status: %', NEW.id, token_id, http_response.status;
            ELSE
                RAISE LOG 'Auto-created quote from expertise report but no client email or phone found for client: %', NEW.client_id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;