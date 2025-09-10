-- Créer les tables pour les processus et étapes de workflow
CREATE TABLE public.process_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  estimated_total_duration NUMERIC NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_template_id UUID NOT NULL REFERENCES public.process_templates(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  estimated_duration NUMERIC NOT NULL DEFAULT 0,
  required_qualifications TEXT[] DEFAULT '{}',
  is_required BOOLEAN NOT NULL DEFAULT true,
  can_run_in_parallel BOOLEAN NOT NULL DEFAULT false,
  dependencies TEXT[] DEFAULT '{}',
  color TEXT NOT NULL DEFAULT 'bg-blue-100 text-blue-800',
  step_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.process_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour process_templates
CREATE POLICY "Company members can manage process templates" 
ON public.process_templates 
FOR ALL 
USING (user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Créer les politiques RLS pour workflow_steps
CREATE POLICY "Company members can manage workflow steps" 
ON public.workflow_steps 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.process_templates pt 
    WHERE pt.id = workflow_steps.process_template_id 
    AND user_belongs_to_company(auth.uid(), pt.company_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.process_templates pt 
    WHERE pt.id = workflow_steps.process_template_id 
    AND user_belongs_to_company(auth.uid(), pt.company_id)
  )
);

-- Triggers pour updated_at
CREATE TRIGGER update_process_templates_updated_at
BEFORE UPDATE ON public.process_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_steps_updated_at
BEFORE UPDATE ON public.workflow_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer le processus standard pour la carrosserie spécifiée
INSERT INTO public.process_templates (
  id, 
  company_id, 
  name, 
  description, 
  estimated_total_duration, 
  is_default
) VALUES (
  gen_random_uuid(),
  '8d468279-a9ef-4b88-b2fc-345ff5f12ce9',
  'Processus Standard Carrosserie',
  'Processus complet pour réparations de carrosserie avec peinture',
  12,
  true
);

-- Récupérer l'ID du processus inséré pour les étapes
DO $$
DECLARE
  process_id UUID;
BEGIN
  SELECT id INTO process_id 
  FROM public.process_templates 
  WHERE company_id = '8d468279-a9ef-4b88-b2fc-345ff5f12ce9' 
  AND name = 'Processus Standard Carrosserie';

  -- Insérer les étapes du workflow
  INSERT INTO public.workflow_steps (
    process_template_id,
    step_key,
    name,
    description,
    estimated_duration,
    required_qualifications,
    is_required,
    can_run_in_parallel,
    dependencies,
    color,
    step_order
  ) VALUES 
  (
    process_id,
    'accueil',
    'Accueil & Préparation du dossier',
    'Réception du véhicule, évaluation des dégâts, création du dossier client',
    1,
    ARRAY['Diagnostic'],
    true,
    false,
    ARRAY[]::TEXT[],
    'bg-blue-100 text-blue-800',
    1
  ),
  (
    process_id,
    'remplacement',
    'Remplacement ou débosselage',
    'Remplacement des pièces endommagées ou débosselage',
    2.5,
    ARRAY['Carrosserie', 'Débosselage'],
    true,
    false,
    ARRAY['accueil'],
    'bg-green-100 text-green-800',
    2
  ),
  (
    process_id,
    'preparation',
    'Préparation peinture',
    'Ponçage, masquage, apprêt',
    2.5,
    ARRAY['Peinture', 'Préparation'],
    true,
    false,
    ARRAY['remplacement'],
    'bg-yellow-100 text-yellow-800',
    3
  ),
  (
    process_id,
    'peinture',
    'Mise en peinture',
    'Application de la peinture, séchage',
    4,
    ARRAY['Peinture'],
    true,
    false,
    ARRAY['preparation'],
    'bg-purple-100 text-purple-800',
    4
  ),
  (
    process_id,
    'finitions',
    'Finitions & remontage',
    'Polissage, remontage des éléments',
    1.5,
    ARRAY['Polissage', 'Carrosserie'],
    true,
    false,
    ARRAY['peinture'],
    'bg-red-100 text-red-800',
    5
  ),
  (
    process_id,
    'cloture',
    'Clôture du dossier et livraison',
    'Contrôle qualité final, nettoyage, livraison',
    0.5,
    ARRAY['Diagnostic'],
    true,
    false,
    ARRAY['finitions'],
    'bg-orange-100 text-orange-800',
    6
  );
END $$;