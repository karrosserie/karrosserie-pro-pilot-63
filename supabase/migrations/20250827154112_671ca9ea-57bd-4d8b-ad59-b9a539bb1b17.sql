-- Ajouter l'utilisateur carrossier@gmail.com
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Générer un UUID pour l'utilisateur
    user_uuid := gen_random_uuid();
    
    -- Insérer l'utilisateur dans auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        user_uuid,
        'carrossier@gmail.com',
        crypt('carrossier', gen_salt('bf')),
        NOW(),
        '{"first_name": "Carrossier", "last_name": "User", "phone_number": "0123456789"}'::jsonb,
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

    -- Créer le profil correspondant
    INSERT INTO public.profiles (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        created_at,
        updated_at
    ) VALUES (
        user_uuid,
        'Carrossier',
        'User',
        'carrossier@gmail.com',
        '0123456789',
        'user',
        NOW(),
        NOW()
    );

    -- Associer l'utilisateur à l'entreprise de test (si elle existe)
    INSERT INTO public.user_companies (
        user_id,
        company_id,
        role,
        active,
        created_at,
        updated_at
    ) VALUES (
        user_uuid,
        '550e8400-e29b-41d4-a716-446655440000'::uuid,
        'Carrossier',
        true,
        NOW(),
        NOW()
    );
    
EXCEPTION 
    WHEN unique_violation THEN
        RAISE NOTICE 'L''utilisateur carrossier@gmail.com existe déjà';
END $$;