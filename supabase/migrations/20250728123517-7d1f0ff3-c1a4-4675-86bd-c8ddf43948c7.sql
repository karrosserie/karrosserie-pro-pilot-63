-- Fonction pour créer automatiquement un devis à partir d'un rapport d'expertise
CREATE OR REPLACE FUNCTION public.auto_create_quote_from_expertise_report()
RETURNS TRIGGER AS $$
DECLARE
    last_quote_ref text;
    new_reference text;
    quote_data jsonb;
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
            
            RAISE LOG 'Auto-created quote from expertise report: %', NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger qui s'exécute après l'insertion d'un rapport d'expertise
CREATE TRIGGER trigger_auto_create_quote_from_expertise_report
    AFTER INSERT ON public.expertise_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_create_quote_from_expertise_report();