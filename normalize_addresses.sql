-- Script pour normaliser les adresses dans la table clients
-- Extrait le code postal (5 chiffres) et la ville de l'adresse complète
-- Sépare en 3 champs : address, postal_code, city

-- Mise à jour des adresses avec code postal détecté
UPDATE clients
SET 
    postal_code = SUBSTRING(address FROM '\d{5}'),
    city = TRIM(REGEXP_REPLACE(
        SUBSTRING(address FROM '\d{5}.*'),
        '^\d{5}[\s,\-]*',
        ''
    )),
    address = TRIM(REGEXP_REPLACE(
        address,
        '[\s,\-]*\d{5}.*$',
        ''
    ))
WHERE 
    address IS NOT NULL 
    AND address != ''
    AND address ~ '\d{5}'  -- Contient un code postal
    AND (postal_code IS NULL OR postal_code = '');  -- Pas encore normalisé

-- Afficher un résumé des modifications
SELECT
    CASE
        WHEN postal_code IS NOT NULL AND postal_code ~ '^\d{5}$' AND city IS NOT NULL THEN '✅ Adresse complète normalisée'
        WHEN address ~ '\d{5}' THEN '⚠️ Contient un code postal mais non extrait'
        WHEN address IS NULL THEN '❌ Pas d''adresse'
        ELSE '⚠️ Pas de code postal détecté'
    END as status,
    COUNT(*) as count_clients
FROM clients
GROUP BY status
ORDER BY count_clients DESC;

-- Afficher quelques exemples d'adresses normalisées
SELECT
    id,
    first_name,
    last_name,
    address,
    postal_code,
    city,
    CASE
        WHEN postal_code ~ '^\d{5}$' AND city IS NOT NULL AND city != '' THEN '✅ OK'
        ELSE '⚠️ À vérifier'
    END as validation_status
FROM clients
WHERE address IS NOT NULL
ORDER BY 
    CASE WHEN postal_code ~ '^\d{5}$' THEN 0 ELSE 1 END,
    id
LIMIT 30;
