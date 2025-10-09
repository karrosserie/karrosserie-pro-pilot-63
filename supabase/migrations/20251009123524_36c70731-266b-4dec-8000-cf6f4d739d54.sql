-- Supprimer l'ancienne policy de lecture restreinte aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated users can read ai messages" ON public.ai_messages_history;

-- Créer une nouvelle policy permettant la lecture publique
CREATE POLICY "Anyone can read ai messages"
ON public.ai_messages_history
FOR SELECT
USING (true);

-- Modifier la policy de mise à jour pour permettre aussi aux utilisateurs non authentifiés
DROP POLICY IF EXISTS "Authenticated users can update read status" ON public.ai_messages_history;

CREATE POLICY "Anyone can update read status"
ON public.ai_messages_history
FOR UPDATE
USING (true)
WITH CHECK (true);