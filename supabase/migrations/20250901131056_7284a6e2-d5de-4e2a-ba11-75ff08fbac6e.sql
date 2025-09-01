-- Créer la table pour les dossiers judiciaires
CREATE TABLE public.judicial_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  client_id UUID,
  invoice_id UUID,
  reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  
  -- Parties
  demandeur TEXT,
  defendeur TEXT,
  relation TEXT,
  
  -- Faits
  chronologie TEXT,
  contexte TEXT,
  
  -- Juridique
  obligations TEXT,
  references_legales TEXT,
  
  -- Demandes
  montant_dossier NUMERIC,
  demandes TEXT,
  interets BOOLEAN DEFAULT false,
  interets_details TEXT,
  depens BOOLEAN DEFAULT false,
  depens_details TEXT,
  
  -- Pièces
  pieces TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.judicial_cases ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Company members can manage judicial cases" 
ON public.judicial_cases 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Créer le trigger pour updated_at
CREATE TRIGGER update_judicial_cases_updated_at
BEFORE UPDATE ON public.judicial_cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();