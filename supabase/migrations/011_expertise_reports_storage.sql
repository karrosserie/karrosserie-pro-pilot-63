
-- Create storage bucket for expertise reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('expertise_reports', 'expertise_reports', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for expertise reports
CREATE POLICY "Users can upload own expertise reports" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'expertise_reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own expertise reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'expertise_reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own expertise reports" ON storage.objects
  FOR UPDATE USING (bucket_id = 'expertise_reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own expertise reports" ON storage.objects
  FOR DELETE USING (bucket_id = 'expertise_reports' AND auth.uid()::text = (storage.foldername(name))[1]);
