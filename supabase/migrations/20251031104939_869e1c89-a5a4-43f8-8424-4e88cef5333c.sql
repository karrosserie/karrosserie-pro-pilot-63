-- Migration: Corriger les messagerie_replies et is_inbound
-- Étape 1 : Créer les messagerie_replies manquantes pour toutes les messageries existantes
INSERT INTO public.messagerie_replies (
  messagerie_id,
  company_id,
  sender_type,
  sender_id,
  content,
  channel,
  actual_communication_date,
  is_inbound,
  sent_at,
  read_by_client,
  read_by_company
)
SELECT 
  m.id,
  m.company_id,
  CASE 
    -- Si c'est une "Demande de justificatifs", c'est envoyé par la carrosserie
    WHEN m.title LIKE 'Demande de justificatifs%' THEN 'carrosserie'
    -- Sinon, c'est probablement un message client
    ELSE 'client'
  END as sender_type,
  CASE 
    WHEN m.title LIKE 'Demande de justificatifs%' THEN NULL -- Message de la carrosserie
    ELSE m.client_id -- Message du client
  END as sender_id,
  m.message,
  m.channel,
  m.actual_communication_date,
  -- Si c'est une demande, c'est un message sortant (is_inbound = false)
  CASE 
    WHEN m.title LIKE 'Demande de justificatifs%' THEN false
    ELSE true
  END as is_inbound,
  m.created_at,
  CASE 
    WHEN m.title LIKE 'Demande de justificatifs%' THEN false
    ELSE true
  END as read_by_client,
  CASE 
    WHEN m.title LIKE 'Demande de justificatifs%' THEN true
    ELSE false
  END as read_by_company
FROM public.messageries m
WHERE NOT EXISTS (
  SELECT 1 FROM public.messagerie_replies mr
  WHERE mr.messagerie_id = m.id
);

-- Étape 2 : Corriger is_inbound dans messageries
UPDATE public.messageries
SET is_inbound = CASE 
  WHEN title LIKE 'Demande de justificatifs%' THEN false
  ELSE true
END
WHERE is_inbound = false;

-- Étape 3 : Mettre à jour les compteurs replies_count
UPDATE public.messageries m
SET 
  replies_count = (
    SELECT COUNT(*) 
    FROM public.messagerie_replies mr 
    WHERE mr.messagerie_id = m.id
  ),
  last_reply_at = (
    SELECT MAX(sent_at) 
    FROM public.messagerie_replies mr 
    WHERE mr.messagerie_id = m.id
  )
WHERE replies_count IS NULL OR replies_count = 0;

-- Étape 4 : Mettre à jour le statut des messageries
UPDATE public.messageries m
SET status = CASE
  WHEN m.resolved THEN 'resolu'
  WHEN m.archived THEN 'archive'
  WHEN EXISTS (
    SELECT 1 FROM public.messagerie_replies mr
    WHERE mr.messagerie_id = m.id 
      AND mr.sender_type = 'carrosserie'
      AND mr.sent_at = (
        SELECT MAX(sent_at) FROM public.messagerie_replies
        WHERE messagerie_id = m.id
      )
  ) THEN 'en_attente_client'
  ELSE 'nouveau'
END
WHERE status IS NULL OR status = 'nouveau';