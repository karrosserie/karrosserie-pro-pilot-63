-- Créer les politiques RLS pour la table verif_doc_client

-- Politique pour permettre à l'edge function (service role) de tout gérer
CREATE POLICY "Service role can manage all verif_doc_client"
ON public.verif_doc_client
FOR ALL
USING (true);

-- Politique pour permettre aux membres d'une company de voir leurs enregistrements
CREATE POLICY "Company members can view their verif_doc_client"
ON public.verif_doc_client
FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

-- Politique pour permettre aux membres d'une company d'insérer
CREATE POLICY "Company members can insert verif_doc_client"
ON public.verif_doc_client
FOR INSERT
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Politique pour permettre aux membres d'une company de mettre à jour
CREATE POLICY "Company members can update their verif_doc_client"
ON public.verif_doc_client
FOR UPDATE
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));