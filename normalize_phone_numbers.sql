-- Script pour normaliser les numéros de téléphone français dans la table clients
-- Formats acceptés en entrée :
-- - 06XXXXXXXX ou 07XXXXXXXX (mobile)
-- - +336XXXXXXXX ou +337XXXXXXXX (mobile international)
-- - 0033 6XXXXXXXX ou 0033 7XXXXXXXX (mobile international avec espace)
-- - 06 XX XX XX XX (avec espaces/points/tirets)
-- Tous seront convertis au format : +336XXXXXXXX ou +337XXXXXXXX

-- Mise à jour des numéros de téléphone
UPDATE clients
SET phone = CASE
    -- Si déjà au format +33, on nettoie juste les espaces/points/tirets
    WHEN REGEXP_REPLACE(phone, '[\s.\-]', '', 'g') ~ '^\+33[67]\d{8}$' THEN
        REGEXP_REPLACE(phone, '[\s.\-]', '', 'g')
    
    -- Si format 0033, convertir en +33
    WHEN REGEXP_REPLACE(phone, '[\s.\-]', '', 'g') ~ '^0033[67]\d{8}$' THEN
        '+33' || SUBSTRING(REGEXP_REPLACE(phone, '[\s.\-]', '', 'g') FROM 5)
    
    -- Si format français 06 ou 07, convertir en +33
    WHEN REGEXP_REPLACE(phone, '[\s.\-]', '', 'g') ~ '^0[67]\d{8}$' THEN
        '+33' || SUBSTRING(REGEXP_REPLACE(phone, '[\s.\-]', '', 'g') FROM 2)
    
    -- Sinon, garder tel quel
    ELSE phone
END
WHERE phone IS NOT NULL
AND phone != '';

-- Afficher un résumé des modifications
SELECT
    CASE
        WHEN phone ~ '^\+33[67]\d{8}$' THEN '✅ Format international valide (+33)'
        WHEN phone ~ '^0[67]' THEN '⚠️ Format français (06/07) - non modifié'
        WHEN phone IS NULL THEN '❌ Pas de téléphone'
        ELSE '⚠️ Format non reconnu - non modifié'
    END as format_status,
    COUNT(*) as count_clients,
    ARRAY_AGG(phone ORDER BY phone LIMIT 3) as exemples
FROM clients
GROUP BY format_status
ORDER BY count_clients DESC;

-- Afficher quelques exemples de clients avec leurs numéros normalisés
SELECT
    id,
    first_name,
    last_name,
    phone,
    CASE
        WHEN phone ~ '^\+33[67]\d{8}$' THEN '✅ Valide'
        ELSE '⚠️ À vérifier'
    END as validation_status
FROM clients
WHERE phone IS NOT NULL
ORDER BY phone
LIMIT 20;
