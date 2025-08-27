-- Ajouter le plan d'essai gratuit pour toutes les entreprises existantes qui n'ont pas d'abonnement actif
DO $$
DECLARE
    trial_plan_id uuid;
    company_record record;
BEGIN
    -- Récupérer l'ID du plan d'essai
    SELECT id INTO trial_plan_id 
    FROM public.subscription_plans 
    WHERE name = 'Plan d''Essai' AND is_active = true 
    LIMIT 1;
    
    -- Vérifier que le plan d'essai existe
    IF trial_plan_id IS NULL THEN
        RAISE EXCEPTION 'Plan d''essai introuvable';
    END IF;
    
    -- Pour chaque entreprise qui n'a pas d'abonnement actif
    FOR company_record IN 
        SELECT ci.id as company_id
        FROM public.company_info ci
        LEFT JOIN public.company_subscriptions cs ON ci.id = cs.company_id AND cs.status = 'active'
        WHERE cs.id IS NULL
    LOOP
        -- Créer l'abonnement d'essai
        INSERT INTO public.company_subscriptions (
            company_id,
            subscription_plan_id,
            status,
            start_date,
            end_date,
            next_billing_date,
            tokens_remaining,
            tokens_used
        ) VALUES (
            company_record.company_id,
            trial_plan_id,
            'active',
            NOW(),
            NOW() + INTERVAL '30 days',
            NULL, -- Pas de prélèvement pour l'essai
            25, -- Jetons inclus dans l'essai
            0
        );
        
        RAISE NOTICE 'Plan d''essai ajouté pour l''entreprise: %', company_record.company_id;
    END LOOP;
    
    RAISE NOTICE 'Migration terminée: plans d''essai ajoutés pour toutes les entreprises existantes sans abonnement';
END $$;