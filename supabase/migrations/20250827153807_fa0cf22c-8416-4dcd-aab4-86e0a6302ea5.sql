-- Créer une entreprise de test
INSERT INTO public.company_info (
    id,
    name,
    email,
    phone,
    address,
    city,
    zipcode,
    siren,
    siret,
    tva,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Karrosserie Pro Test',
    'contact@karrosseriepro-test.fr',
    '01 23 45 67 89',
    '123 Rue de la Carrosserie',
    'Paris',
    '75001',
    '123456789',
    '12345678901234',
    'FR12345678901',
    NOW(),
    NOW()
);

-- Créer les préférences d'entreprise
INSERT INTO public.company_preferences (
    company_id,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    NOW(),
    NOW()
);

-- Créer les utilisateurs directement dans auth.users avec leurs métadonnées
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
) VALUES 
-- Carrossier
(
    '11111111-1111-1111-1111-111111111111'::uuid,
    'carrossier@gmail.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"first_name": "Jean", "last_name": "Carrossier", "phone_number": "0123456789"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- Carrossier Courtois
(
    '22222222-2222-2222-2222-222222222222'::uuid,
    'carrossiercourtois@gmail.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"first_name": "Pierre", "last_name": "Courtois", "phone_number": "0123456790"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- Responsable
(
    '33333333-3333-3333-3333-333333333333'::uuid,
    'responsable@gmail.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"first_name": "Marie", "last_name": "Responsable", "phone_number": "0123456791"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- Responsable Admin
(
    '44444444-4444-4444-4444-444444444444'::uuid,
    'responsableadmin@gmail.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"first_name": "Admin", "last_name": "Responsable", "phone_number": "0123456792"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Créer les profils pour chaque utilisateur
INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone_number,
    role,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Jean',
    'Carrossier',
    'carrossier@gmail.com',
    '0123456789',
    'user',
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Pierre',
    'Courtois',
    'carrossiercourtois@gmail.com',
    '0123456790',
    'user',
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Marie',
    'Responsable',
    'responsable@gmail.com',
    '0123456791',
    'user',
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Admin',
    'Responsable',
    'responsableadmin@gmail.com',
    '0123456792',
    'admin',
    NOW(),
    NOW()
);

-- Associer les utilisateurs à l'entreprise avec leurs rôles
INSERT INTO public.user_companies (
    user_id,
    company_id,
    role,
    active,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Carrossier',
    true,
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Carrossier',
    true,
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Responsable',
    true,
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Propriétaire',
    true,
    NOW(),
    NOW()
);

-- Créer un abonnement d'essai pour l'entreprise
INSERT INTO public.company_subscriptions (
    company_id,
    subscription_plan_id,
    status,
    start_date,
    end_date,
    tokens_remaining,
    tokens_used,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    (SELECT id FROM public.subscription_plans WHERE name = 'Plan d''Essai' LIMIT 1),
    'active',
    NOW(),
    NOW() + INTERVAL '30 days',
    25,
    0,
    NOW(),
    NOW()
);