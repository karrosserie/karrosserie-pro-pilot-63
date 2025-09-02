-- Create violations storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('violations', 'violations', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for violations bucket
CREATE POLICY "Users can view their own violation documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'violations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own violation documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'violations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own violation documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'violations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own violation documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'violations' AND auth.uid()::text = (storage.foldername(name))[1]);