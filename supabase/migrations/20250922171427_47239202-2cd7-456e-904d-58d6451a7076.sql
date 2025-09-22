-- Créer la table bon_commande
CREATE TABLE public.bon_commande (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  client_id UUID,
  quote_id UUID,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bon_commande ENABLE ROW LEVEL SECURITY;

-- Create policies for company access
CREATE POLICY "Company members can manage their bon de commande" 
ON public.bon_commande 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_bon_commande_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bon_commande_updated_at
BEFORE UPDATE ON public.bon_commande
FOR EACH ROW
EXECUTE FUNCTION public.update_bon_commande_updated_at();