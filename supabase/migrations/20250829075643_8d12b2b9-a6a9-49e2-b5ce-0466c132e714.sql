-- Create storage bucket for violation documents
INSERT INTO storage.buckets (id, name, public) VALUES ('violations', 'violations', false);

-- Create RLS policies for violation documents
CREATE POLICY "Company members can view their violation documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'violations' 
  AND EXISTS (
    SELECT 1 FROM public.fleet_violations fv
    WHERE fv.document_url LIKE '%' || name || '%'
    AND user_belongs_to_company(auth.uid(), fv.company_id)
  )
);

CREATE POLICY "Company members can upload violation documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'violations'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Company members can update their violation documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'violations'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Company members can delete their violation documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'violations'
  AND EXISTS (
    SELECT 1 FROM public.fleet_violations fv
    WHERE fv.document_url LIKE '%' || name || '%'
    AND user_belongs_to_company(auth.uid(), fv.company_id)
  )
);