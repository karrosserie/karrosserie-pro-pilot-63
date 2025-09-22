-- Créer la table bon_livraison
CREATE TABLE public.bon_livraison (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  bon_commande_id UUID NOT NULL REFERENCES public.bon_commande(id) ON DELETE CASCADE,
  client_id UUID,
  transporteur TEXT,
  date_livraison_prevue DATE,
  date_livraison_reelle DATE,
  notes TEXT,
  statut TEXT NOT NULL DEFAULT 'En préparation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bon_livraison ENABLE ROW LEVEL SECURITY;

-- Create policies for company access
CREATE POLICY "Company members can manage their bon de livraison" 
ON public.bon_livraison 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_bon_livraison_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bon_livraison_updated_at
BEFORE UPDATE ON public.bon_livraison
FOR EACH ROW
EXECUTE FUNCTION public.update_bon_livraison_updated_at();