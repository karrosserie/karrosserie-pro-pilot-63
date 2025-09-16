-- Fix RLS policies for tracking tables to allow proper user tracking

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can manage their own page visits" ON public.page_visit_durations;
DROP POLICY IF EXISTS "Users can manage their own funnel progress" ON public.user_funnel_progress;
DROP POLICY IF EXISTS "Users can manage their own errors" ON public.user_errors_abandons;

-- Create proper RLS policies for user_activity_logs
CREATE POLICY "Users can manage their own activity logs" 
ON public.user_activity_logs 
FOR ALL 
USING (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
);

-- Create proper RLS policies for page_visit_durations
CREATE POLICY "Users can manage their own page visits" 
ON public.page_visit_durations 
FOR ALL 
USING (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
);

-- Create proper RLS policies for user_funnel_progress
CREATE POLICY "Users can manage their own funnel progress" 
ON public.user_funnel_progress 
FOR ALL 
USING (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
);

-- Create proper RLS policies for user_errors_abandons
CREATE POLICY "Users can manage their own errors and abandons" 
ON public.user_errors_abandons 
FOR ALL 
USING (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() = user_id OR 
  user_belongs_to_company(auth.uid(), company_id) OR 
  get_current_user_role() = 'admin'
);