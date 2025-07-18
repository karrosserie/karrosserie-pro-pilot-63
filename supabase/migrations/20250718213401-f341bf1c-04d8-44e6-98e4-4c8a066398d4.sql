-- First, drop the dependent policies
DROP POLICY "Users can manage own company info" ON public.company_info;
DROP POLICY "Company owners can manage team members" ON public.user_companies;

-- Remove user_id column from company_info table as we now use user_companies for the relationship
ALTER TABLE public.company_info 
DROP COLUMN user_id;

-- Create new policies that use user_companies table for access control
-- Users can view company info if they belong to the company
CREATE POLICY "Users can view company info if they belong to company" 
ON public.company_info 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = company_info.id 
    AND uc.user_id = auth.uid()
    AND uc.active = true
  )
);

-- Users can update company info if they are owner
CREATE POLICY "Company owners can update company info" 
ON public.company_info 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = company_info.id 
    AND uc.user_id = auth.uid()
    AND uc.role = 'Propriétaire'
    AND uc.active = true
  )
);

-- Users can insert company info if they are owner
CREATE POLICY "Company owners can create company info" 
ON public.company_info 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = company_info.id 
    AND uc.user_id = auth.uid()
    AND uc.role = 'Propriétaire'
    AND uc.active = true
  )
);

-- Users can delete company info if they are owner
CREATE POLICY "Company owners can delete company info" 
ON public.company_info 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = company_info.id 
    AND uc.user_id = auth.uid()
    AND uc.role = 'Propriétaire'
    AND uc.active = true
  )
);

-- Recreate the user_companies policy for company owners
CREATE POLICY "Company owners can manage team members" 
ON public.user_companies 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = user_companies.company_id 
    AND uc.user_id = auth.uid()
    AND uc.role = 'Propriétaire'
    AND uc.active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = user_companies.company_id 
    AND uc.user_id = auth.uid()
    AND uc.role = 'Propriétaire'
    AND uc.active = true
  )
);