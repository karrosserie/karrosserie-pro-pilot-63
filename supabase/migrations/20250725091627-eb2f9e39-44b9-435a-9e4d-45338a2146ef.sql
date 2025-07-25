-- Créer la table imports
CREATE TABLE public.imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'En cours d''analyse',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter une contrainte pour les statuts autorisés
ALTER TABLE public.imports 
ADD CONSTRAINT imports_status_check 
CHECK (status IN ('En cours d''analyse', 'Importé', 'En erreur'));

-- Ajouter la clé étrangère vers expertise_reports
ALTER TABLE public.imports 
ADD CONSTRAINT imports_report_id_fkey 
FOREIGN KEY (report_id) REFERENCES public.expertise_reports(id) ON DELETE CASCADE;

-- Activer RLS
ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS (seuls les propriétaires des rapports peuvent voir leurs imports)
CREATE POLICY "Users can view imports of their own reports" 
ON public.imports 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.expertise_reports er 
    WHERE er.id = imports.report_id AND er.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert imports for their own reports" 
ON public.imports 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.expertise_reports er 
    WHERE er.id = imports.report_id AND er.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update imports of their own reports" 
ON public.imports 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.expertise_reports er 
    WHERE er.id = imports.report_id AND er.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete imports of their own reports" 
ON public.imports 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.expertise_reports er 
    WHERE er.id = imports.report_id AND er.user_id = auth.uid()
  )
);

-- Créer le trigger pour updated_at
CREATE TRIGGER update_imports_updated_at
BEFORE UPDATE ON public.imports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();