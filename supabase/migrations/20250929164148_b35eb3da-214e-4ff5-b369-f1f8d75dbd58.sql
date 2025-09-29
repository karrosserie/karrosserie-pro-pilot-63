-- Corriger l'edge function send-token-alert pour ne pas échouer si le webhook n'existe pas
-- Et examiner les contraintes sur user_sessions

-- Vérifier les contraintes sur user_sessions
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_sessions' 
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;