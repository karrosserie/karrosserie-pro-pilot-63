-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admin users can view all company info" ON public.company_info;
DROP POLICY IF EXISTS "Admin users can view all user companies" ON public.user_companies;
DROP POLICY IF EXISTS "Admin users can view all company subscriptions" ON public.company_subscriptions;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create policy to allow admin users to view all company info
CREATE POLICY "Admin users can view all company info" 
ON public.company_info 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Create policy to allow admin users to view all user companies
CREATE POLICY "Admin users can view all user companies" 
ON public.user_companies 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Create policy to allow admin users to view all company subscriptions
CREATE POLICY "Admin users can view all company subscriptions" 
ON public.company_subscriptions 
FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');