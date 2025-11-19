-- Ajouter les politiques RLS pour all_client_message

-- Permettre aux utilisateurs authentifiés d'insérer des messages pour leur entreprise
CREATE POLICY "Users can insert messages for their company"
ON public.all_client_message
FOR INSERT
TO authenticated
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id)
);

-- Permettre aux utilisateurs authentifiés de lire les messages de leur entreprise
CREATE POLICY "Users can view messages for their company"
ON public.all_client_message
FOR SELECT
TO authenticated
USING (
  user_belongs_to_company(auth.uid(), company_id)
);

-- Permettre au service role de tout gérer (pour les edge functions)
CREATE POLICY "Service role can manage all messages"
ON public.all_client_message
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);