-- Create signature_requests table for tracking repair order and cession signatures
CREATE TABLE public.signature_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  
  -- Type de signature
  request_type TEXT NOT NULL CHECK (request_type IN ('ordre_reparation', 'cession_creance')),
  
  -- Référence du document
  repair_order_id UUID REFERENCES public.repair_orders(id) ON DELETE CASCADE,
  cession_id UUID REFERENCES public.cessions(id) ON DELETE CASCADE,
  document_reference TEXT NOT NULL,
  
  -- Statut de la signature
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'envoye', 'signe', 'refuse', 'expire')),
  signature_mode TEXT CHECK (signature_mode IN ('electronique', 'en_personne')),
  
  -- Données Oodrive
  oodrive_contract_id TEXT,
  document_url TEXT,
  signed_document_url TEXT,
  
  -- Dates
  sent_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Signature manuelle
  client_signature_data TEXT,
  client_name TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Company members can manage signature requests"
  ON public.signature_requests
  FOR ALL
  USING (user_belongs_to_company(auth.uid(), company_id))
  WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Indexes for performance
CREATE INDEX idx_signature_requests_company_id ON public.signature_requests(company_id);
CREATE INDEX idx_signature_requests_client_id ON public.signature_requests(client_id);
CREATE INDEX idx_signature_requests_vehicle_id ON public.signature_requests(vehicle_id);
CREATE INDEX idx_signature_requests_repair_order_id ON public.signature_requests(repair_order_id);
CREATE INDEX idx_signature_requests_cession_id ON public.signature_requests(cession_id);
CREATE INDEX idx_signature_requests_status ON public.signature_requests(status);
CREATE INDEX idx_signature_requests_request_type ON public.signature_requests(request_type);

-- Trigger for updated_at
CREATE TRIGGER update_signature_requests_updated_at
  BEFORE UPDATE ON public.signature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();