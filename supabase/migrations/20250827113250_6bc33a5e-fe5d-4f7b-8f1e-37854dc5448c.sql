-- Create policy to allow admin users to view all company info
CREATE POLICY "Admin users can view all company info" 
ON public.company_info 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create policy to allow admin users to view all user companies
CREATE POLICY "Admin users can view all user companies" 
ON public.user_companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create policy to allow admin users to view all company subscriptions
CREATE POLICY "Admin users can view all company subscriptions" 
ON public.company_subscriptions 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);