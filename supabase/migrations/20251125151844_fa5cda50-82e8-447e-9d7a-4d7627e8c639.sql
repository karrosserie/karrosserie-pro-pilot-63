-- Migration pour normaliser les adresses dans la table company_info
-- Extrait le code postal (5 chiffres) et la ville de l'adresse complète
-- Sépare en 3 champs : address, postal_code, city

-- Mise à jour des adresses avec code postal détecté
UPDATE company_info
SET 
    zipcode = SUBSTRING(address FROM '\d{5}'),
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
    AND (zipcode IS NULL OR zipcode = '');  -- Pas encore normalisé

-- Afficher un résumé des modifications
SELECT
    CASE
        WHEN zipcode IS NOT NULL AND zipcode ~ '^\d{5}$' AND city IS NOT NULL THEN '✅ Adresse complète normalisée'
        WHEN address ~ '\d{5}' THEN '⚠️ Contient un code postal mais non extrait'
        WHEN address IS NULL THEN '❌ Pas d''adresse'
        ELSE '⚠️ Pas de code postal détecté'
    END as status,
    COUNT(*) as count_companies
FROM company_info
GROUP BY status
ORDER BY count_companies DESC;

-- Afficher quelques exemples d'adresses normalisées
SELECT
    id,
    name,
    address,
    zipcode,
    city,
    CASE
        WHEN zipcode ~ '^\d{5}$' AND city IS NOT NULL AND city != '' THEN '✅ OK'
        ELSE '⚠️ À vérifier'
    END as validation_status
FROM company_info
WHERE address IS NOT NULL
ORDER BY 
    CASE WHEN zipcode ~ '^\d{5}$' THEN 0 ELSE 1 END,
    id
LIMIT 10;