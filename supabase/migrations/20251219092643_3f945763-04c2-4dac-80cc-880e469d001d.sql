-- Supprimer les entrées dupliquées dans messagerie_replies pour les envois automatiques
DELETE FROM messagerie_replies 
WHERE messagerie_id IN (
  SELECT id FROM messageries 
  WHERE tags::text LIKE '%envoi_automatique%'
);