-- Allow public read access to employee schedule
CREATE POLICY "Allow public read employee schedule" 
ON public.employee_schedule 
FOR SELECT 
USING (true);