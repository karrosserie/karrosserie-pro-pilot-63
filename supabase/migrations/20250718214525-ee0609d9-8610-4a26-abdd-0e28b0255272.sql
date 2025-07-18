-- Fix infinite recursion in user_companies policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view company members if they belong to the company" ON public.user_companies;
DROP POLICY IF EXISTS "Company owners can manage team members" ON public.user_companies;

-- Create a security definer function to check user company membership
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(p_user_id UUID, p_company_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_companies
    WHERE user_id = p_user_id 
    AND company_id = p_company_id 
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a security definer function to check if user is company owner
CREATE OR REPLACE FUNCTION public.user_is_company_owner(p_user_id UUID, p_company_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_companies
    WHERE user_id = p_user_id 
    AND company_id = p_company_id 
    AND role = 'Propriétaire'
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies using the security definer functions
CREATE POLICY "Users can view their company members" 
ON public.user_companies 
FOR SELECT 
USING (
  public.user_belongs_to_company(auth.uid(), user_companies.company_id)
);

CREATE POLICY "Company owners can manage team members" 
ON public.user_companies 
FOR ALL 
USING (
  public.user_is_company_owner(auth.uid(), user_companies.company_id)
)
WITH CHECK (
  public.user_is_company_owner(auth.uid(), user_companies.company_id)
);