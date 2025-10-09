-- Supprimer les policies existantes si elles existent
DROP POLICY IF EXISTS "Authenticated users can read ai messages" ON public.ai_messages_history;
DROP POLICY IF EXISTS "Service role can insert ai messages" ON public.ai_messages_history;
DROP POLICY IF EXISTS "Authenticated users can update read status" ON public.ai_messages_history;

-- Créer la table ai_messages_history si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.ai_messages_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  session_id VARCHAR,
  message JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);

-- Créer les index s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_ai_messages_history_session_id 
ON public.ai_messages_history(session_id);

CREATE INDEX IF NOT EXISTS idx_ai_messages_history_read 
ON public.ai_messages_history(read);

CREATE INDEX IF NOT EXISTS idx_ai_messages_history_created_at 
ON public.ai_messages_history(created_at DESC);

-- Activer RLS
ALTER TABLE public.ai_messages_history ENABLE ROW LEVEL SECURITY;

-- Créer les policies
CREATE POLICY "Authenticated users can read ai messages"
ON public.ai_messages_history
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Service role can insert ai messages"
ON public.ai_messages_history
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Authenticated users can update read status"
ON public.ai_messages_history
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Ajouter des commentaires
COMMENT ON TABLE public.ai_messages_history IS 'Historique des messages envoyés par l''agent IA n8n avec suivi de lecture';
COMMENT ON COLUMN public.ai_messages_history.read IS 'Indique si le message a été lu par l''utilisateur';