-- Script pour tester différents formats de numéros de téléphone français
-- À exécuter via l'interface Supabase Dashboard -> SQL Editor

-- 1. Ajouter les colonnes nécessaires à repair_orders
ALTER TABLE repair_orders
ADD COLUMN IF NOT EXISTS oodrive_contract_id VARCHAR,
ADD COLUMN IF NOT EXISTS signed_document_url VARCHAR;

-- 2. Créer des clients de test avec différents formats de téléphone
DO $$
DECLARE
    client_ids UUID[] := ARRAY(
        SELECT DISTINCT client_id::UUID
        FROM repair_orders
        WHERE client_id IS NOT NULL
        LIMIT 6
    );
    phone_formats TEXT[] := ARRAY[
        '0612345678',      -- Format français standard
        '0712345678',      -- Format français mobile 07
        '+33612345678',    -- Format international +33 6
        '+33712345678',    -- Format international +33 7
        '06 12 34 56 78',  -- Avec espaces
        '07.12.34.56.78'   -- Avec points
    ];
    i INTEGER;
BEGIN
    -- Mettre à jour les clients avec différents formats
    FOR i IN 1..LEAST(array_length(client_ids, 1), array_length(phone_formats, 1))
    LOOP
        UPDATE clients
        SET phone = phone_formats[i]
        WHERE id = client_ids[i];
    END LOOP;
END $$;

-- 3. Afficher les résultats pour vérification
SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.phone,
    CASE
        WHEN c.phone ~ '^0[67]\d{8}$' THEN '✅ Format français valide'
        WHEN c.phone ~ '^\+33[67]\d{8}$' THEN '✅ Format international valide'
        WHEN c.phone ~ '^0033[67]\d{8}$' THEN '✅ Format 0033 valide'
        WHEN c.phone ~ '^0[67](\s|\.|-)?\d{2}(\s|\.|-)?\d{2}(\s|\.|-)?\d{2}(\s|\.|-)?\d{2}$' THEN '⚠️ Format avec séparateurs'
        WHEN c.phone IS NULL THEN '❌ Pas de téléphone'
        ELSE '❌ Format non reconnu'
    END as format_status,
    COUNT(ro.id) as repair_orders_count
FROM clients c
LEFT JOIN repair_orders ro ON c.id = ro.client_id
WHERE c.id IN (
    SELECT DISTINCT client_id
    FROM repair_orders
    WHERE client_id IS NOT NULL
    LIMIT 10
)
GROUP BY c.id, c.first_name, c.last_name, c.phone
ORDER BY repair_orders_count DESC;

-- 4. Statistiques des formats de téléphone
SELECT
    CASE
        WHEN phone ~ '^0[67]\d{8}$' THEN 'Format français (06/07)'
        WHEN phone ~ '^\+33[67]\d{8}$' THEN 'Format international (+33)'
        WHEN phone ~ '^0033[67]\d{8}$' THEN 'Format 0033'
        WHEN phone ~ '^0[67]' THEN 'Format français avec séparateurs'
        WHEN phone IS NULL THEN 'Pas de téléphone'
        ELSE 'Autres formats'
    END as format_type,
    COUNT(*) as count_clients
FROM clients
WHERE id IN (
    SELECT DISTINCT client_id
    FROM repair_orders
    WHERE client_id IS NOT NULL
)
GROUP BY format_type
ORDER BY count_clients DESC;