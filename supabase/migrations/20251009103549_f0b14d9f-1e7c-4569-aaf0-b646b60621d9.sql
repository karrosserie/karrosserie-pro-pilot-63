-- Créer la table ai_messages_history basée sur n8n_chat_histories avec colonne read
CREATE TABLE IF NOT EXISTS public.ai_messages_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  session_id VARCHAR,
  message JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);

-- Créer un index sur session_id pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_ai_messages_history_session_id 
ON public.ai_messages_history(session_id);

-- Créer un index sur read pour filtrer rapidement les messages non lus
CREATE INDEX IF NOT EXISTS idx_ai_messages_history_read 
ON public.ai_messages_history(read);

-- Créer un index sur created_at pour le tri chronologique
CREATE INDEX IF NOT EXISTS idx_ai_messages_history_created_at 
ON public.ai_messages_history(created_at DESC);

-- Activer RLS
ALTER TABLE public.ai_messages_history ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs authentifiés peuvent lire les messages
CREATE POLICY "Authenticated users can read ai messages"
ON public.ai_messages_history
FOR SELECT
TO authenticated
USING (true);

-- Policy : Seul le service_role peut insérer de nouveaux messages
CREATE POLICY "Service role can insert ai messages"
ON public.ai_messages_history
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy : Les utilisateurs authentifiés peuvent mettre à jour le statut "read"
CREATE POLICY "Authenticated users can update read status"
ON public.ai_messages_history
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Ajouter des commentaires sur la table
COMMENT ON TABLE public.ai_messages_history IS 'Historique des messages envoyés par l''agent IA n8n avec suivi de lecture';
COMMENT ON COLUMN public.ai_messages_history.read IS 'Indique si le message a été lu par l''utilisateur';