-- Ajouter la colonne company_id à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN company_id uuid REFERENCES public.company_info(id) ON DELETE CASCADE;

-- Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);

-- Mettre à jour les profils existants pour lier aux entreprises via user_companies
UPDATE public.profiles p
SET company_id = uc.company_id
FROM public.user_companies uc
WHERE p.id = uc.user_id 
  AND uc.active = true
  AND p.company_id IS NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN public.profiles.company_id IS 'Référence à l''entreprise principale de l''utilisateur';