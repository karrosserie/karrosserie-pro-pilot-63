-- ============================================
-- MIGRATION 008: Politiques RLS pour la table dossiers
-- ============================================
-- Date: 2025-01-XX
-- Description: Configuration des politiques de sécurité Row Level Security

-- Activer RLS sur la table dossiers
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Company members can view dossiers" ON public.dossiers;
DROP POLICY IF EXISTS "Company members can create dossiers" ON public.dossiers;
DROP POLICY IF EXISTS "Company members can update dossiers" ON public.dossiers;
DROP POLICY IF EXISTS "Company members can delete dossiers" ON public.dossiers;
DROP POLICY IF EXISTS "Admin can manage all dossiers" ON public.dossiers;

-- Politique de lecture : les membres de la company peuvent voir leurs dossiers
CREATE POLICY "Company members can view dossiers"
ON public.dossiers
FOR SELECT
USING (
  user_belongs_to_company(auth.uid(), company_id) 
  OR get_current_user_role() = 'admin'
);

-- Politique de création : les membres de la company peuvent créer des dossiers
CREATE POLICY "Company members can create dossiers"
ON public.dossiers
FOR INSERT
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) 
  OR get_current_user_role() = 'admin'
);

-- Politique de mise à jour : les membres de la company peuvent modifier leurs dossiers
CREATE POLICY "Company members can update dossiers"
ON public.dossiers
FOR UPDATE
USING (
  user_belongs_to_company(auth.uid(), company_id) 
  OR get_current_user_role() = 'admin'
)
WITH CHECK (
  user_belongs_to_company(auth.uid(), company_id) 
  OR get_current_user_role() = 'admin'
);

-- Politique de suppression : les membres de la company peuvent supprimer leurs dossiers
CREATE POLICY "Company members can delete dossiers"
ON public.dossiers
FOR DELETE
USING (
  user_belongs_to_company(auth.uid(), company_id) 
  OR get_current_user_role() = 'admin'
);
