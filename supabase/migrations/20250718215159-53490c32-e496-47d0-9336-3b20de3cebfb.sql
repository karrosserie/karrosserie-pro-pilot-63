-- Update profiles policies to allow company members to see each other's profiles
DROP POLICY IF EXISTS "Users can view own profiles" ON public.profiles;

-- Allow users to view profiles of members in the same company
CREATE POLICY "Users can view company member profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own profile
  auth.uid() = id
  OR
  -- Users can see profiles of other members in the same company
  EXISTS (
    SELECT 1 FROM public.user_companies uc1
    JOIN public.user_companies uc2 ON uc1.company_id = uc2.company_id
    WHERE uc1.user_id = auth.uid()
    AND uc2.user_id = profiles.id
    AND uc1.active = true
    AND uc2.active = true
  )
);