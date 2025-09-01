-- Create messageries table
CREATE TABLE public.messageries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 4),
  title TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('Téléphone', 'Mail', 'WhatsApp', 'Message')),
  eta TEXT NOT NULL,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  message TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  resolved BOOLEAN NOT NULL DEFAULT false,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messageries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Company members can manage their messageries" 
ON public.messageries 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Create updated_at trigger
CREATE TRIGGER update_messageries_updated_at
BEFORE UPDATE ON public.messageries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.messageries (
  company_id, priority, title, channel, eta, summary, message, tags, resolved, archived
) SELECT
  -- Get the first company from company_info for testing
  (SELECT id FROM public.company_info LIMIT 1),
  1,
  'Accident en cours / véhicule immobilisé',
  'Téléphone',
  '2h',
  'Véhicule impliqué dans un accident, immobilisation immédiate, intervention urgente requise.',
  'Le client signale que son véhicule est à l''arrêt complet sur le côté de la route après un impact. Il y a de la fumée qui s''échappe du capot et il ne peut pas le déplacer.',
  '{"sécurité", "immédiat"}',
  false,
  false
WHERE EXISTS (SELECT 1 FROM public.company_info LIMIT 1);

INSERT INTO public.messageries (
  company_id, priority, title, channel, eta, summary, message, tags, resolved, archived
) SELECT
  (SELECT id FROM public.company_info LIMIT 1),
  2,
  'Autorisation assurance manquante / expertise à programmer',
  'Mail',
  '24h',
  'Autorisation assurance absente — expertise à programmer pour débloquer dossier.',
  'L''assurance nous a informé que l''autorisation de réparation n''a pas encore été validée. Le client attend de pouvoir récupérer son véhicule.',
  '{"assurance", "expertise"}',
  false,
  false
WHERE EXISTS (SELECT 1 FROM public.company_info LIMIT 1);

INSERT INTO public.messageries (
  company_id, priority, title, channel, eta, summary, message, tags, resolved, archived
) SELECT
  (SELECT id FROM public.company_info LIMIT 1),
  3,
  'Demande devis (rayure, poc, DSP, smart repair)',
  'Mail',
  '3j',
  'Demande classique de devis pour réparation cosmétique.',
  'Client nous a contactés par mail pour demander un devis pour une petite rayure sur la porte avant.',
  '{"devis"}',
  false,
  false
WHERE EXISTS (SELECT 1 FROM public.company_info LIMIT 1);

INSERT INTO public.messageries (
  company_id, priority, title, channel, eta, summary, message, tags, resolved, archived
) SELECT
  (SELECT id FROM public.company_info LIMIT 1),
  4,
  'Demande info sur délais standards',
  'WhatsApp',
  '7j',
  'Question sur délais moyens de réparation.',
  'Le client nous demande le délai moyen pour une réparation de carrosserie.',
  '{"info"}',
  false,
  false
WHERE EXISTS (SELECT 1 FROM public.company_info LIMIT 1);