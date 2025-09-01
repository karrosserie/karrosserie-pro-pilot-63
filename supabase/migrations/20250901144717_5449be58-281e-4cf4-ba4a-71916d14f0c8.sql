-- Création de la table templates pour stocker les templates persistants
-- Date: 2025-01-20
-- Description: Table pour gérer les templates de documents (relances, mises en demeure, etc.)

BEGIN;

-- Créer la table templates
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('reminders', 'notices', 'contracts', 'legal', 'invoices')),
  description TEXT,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'EMAIL',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'inactive')),
  usage_count INTEGER NOT NULL DEFAULT 0,
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Users can view their company templates" 
ON public.templates 
FOR SELECT 
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Users can create their company templates" 
ON public.templates 
FOR INSERT 
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Users can update their company templates" 
ON public.templates 
FOR UPDATE 
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Users can delete their company templates" 
ON public.templates 
FOR DELETE 
USING (user_belongs_to_company(auth.uid(), company_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_templates_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_templates_updated_at_column();

-- Insert some default templates
INSERT INTO public.templates (company_id, name, category, description, content, type, status, usage_count, performance_data) VALUES
-- Pour l'exemple, on utilise un UUID générique - en réalité ce serait l'ID de la company de l'utilisateur
('00000000-0000-0000-0000-000000000000', 'Relance aimable - Première approche', 'reminders', 'Template pour première relance courte et cordiale, avec ton bienveillant pour maintenir la relation client.', 
'Objet : Rappel aimable - Facture [NUMERO_FACTURE]

Bonjour [NOM_CLIENT],

J''espère que vous allez bien.

Je me permets de vous contacter concernant votre facture [NUMERO_FACTURE] d''un montant de [MONTANT] €, émise le [DATE_EMISSION] et arrivée à échéance le [DATE_ECHEANCE].

À ce jour, nous n''avons pas reçu votre règlement. Il s''agit peut-être d''un simple oubli de votre part ?

Si le règlement a déjà été effectué, merci de ne pas tenir compte de ce message.

Dans le cas contraire, je vous serais reconnaissant de bien vouloir procéder au règlement dans les plus brefs délais.

Je reste à votre disposition pour tout renseignement complémentaire.

Cordialement,
[NOM_ENTREPRISE]', 'EMAIL - RELANCE', 'active', 0, '{"openRate": 72, "responseRate": 28, "paymentRate": 15}'),

('00000000-0000-0000-0000-000000000000', 'Mise en demeure formelle', 'notices', 'Template juridique validé pour mise en demeure officielle avec toutes les mentions légales obligatoires.',
'MISE EN DEMEURE

Madame, Monsieur,

Nous vous mettons en demeure de procéder au règlement de votre dette d''un montant de [MONTANT] € correspondant à notre facture [NUMERO_FACTURE] émise le [DATE_EMISSION].

Cette somme était exigible le [DATE_ECHEANCE] et demeure à ce jour impayée malgré nos relances.

Nous vous accordons un délai de 8 jours à compter de la réception de la présente pour procéder au règlement.

À défaut, nous nous réservons le droit d''engager toute action en recouvrement.

Fait à [VILLE], le [DATE]
[NOM_ENTREPRISE]', 'LRE - MISE EN DEMEURE', 'active', 0, '{"deliveryRate": 95, "paymentRate": 78}');

COMMIT;