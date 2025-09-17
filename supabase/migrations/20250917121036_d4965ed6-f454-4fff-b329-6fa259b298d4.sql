-- Allow public read access to task photos
CREATE POLICY "Allow public read task photos" 
ON public.task_photos 
FOR SELECT 
USING (true);