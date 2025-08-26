-- Créer un enum pour les canaux de relance
CREATE TYPE public.relance_channel AS ENUM (
  'phone',
  'email', 
  'sms',
  'whatsapp',
  'vms',
  'courrier',
  'courrier_recommande'
);

-- Créer un enum pour le ton de la relance
CREATE TYPE public.relance_tone AS ENUM (
  'amical',
  'ferme', 
  'serieux',
  'menacant'
);

-- Créer un enum pour le statut de la relance
CREATE TYPE public.relance_status AS ENUM (
  'en_attente',
  'en_cours',
  'envoye',
  'recu',
  'repondu',
  'echec',
  'annule'
);

-- Créer la table d'historique des relances clients
CREATE TABLE public.client_relances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  client_id UUID NOT NULL,
  
  -- Référence vers la facture/devis/créance concernée (optionnel)
  invoice_id UUID,
  quote_id UUID,
  
  -- Détails de la relance
  channel relance_channel NOT NULL,
  tone relance_tone NOT NULL,
  status relance_status NOT NULL DEFAULT 'en_attente',
  
  -- Contenu de la relance
  subject TEXT,
  message TEXT,
  objective TEXT,
  
  -- Informations sur le cycle de relance
  cycle_day INTEGER, -- Jour J+X dans le cycle de relance
  step_number INTEGER, -- Numéro de l'étape dans le cycle
  is_automated BOOLEAN NOT NULL DEFAULT true,
  
  -- Métadonnées
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Données additionnelles (numéro de téléphone, email utilisé, etc.)
  channel_data JSONB,
  
  -- Suivi
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Ajouter les index pour les performances
CREATE INDEX idx_client_relances_company_id ON public.client_relances(company_id);
CREATE INDEX idx_client_relances_client_id ON public.client_relances(client_id);
CREATE INDEX idx_client_relances_channel ON public.client_relances(channel);
CREATE INDEX idx_client_relances_status ON public.client_relances(status);
CREATE INDEX idx_client_relances_scheduled_at ON public.client_relances(scheduled_at);
CREATE INDEX idx_client_relances_created_at ON public.client_relances(created_at);

-- Activer RLS
ALTER TABLE public.client_relances ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Company members can manage client relances"
ON public.client_relances
FOR ALL
TO authenticated
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Créer le trigger pour updated_at
CREATE TRIGGER update_client_relances_updated_at
  BEFORE UPDATE ON public.client_relances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();