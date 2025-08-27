-- Allow admin users to view all company info for admin accounts page
CREATE POLICY "Admin users can view all company info for management"
ON public.company_info
FOR SELECT
USING (get_current_user_role() = 'admin');

-- Allow admin users to view all company subscriptions for admin accounts page  
CREATE POLICY "Admin users can manage all company subscriptions for management"
ON public.company_subscriptions
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Allow admin users to view all user_companies for counting users
CREATE POLICY "Admin users can view all user companies for management"
ON public.user_companies
FOR SELECT  
USING (get_current_user_role() = 'admin');