-- Add RLS policies for company members to access cession documents in storage
CREATE POLICY "Company members can view cession documents"
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' AND
  name ~ '^company/[a-f0-9-]{36}/cessions/' AND
  user_belongs_to_company(auth.uid(), (regexp_matches(name, '^company/([a-f0-9-]{36})/cessions/'))[1]::uuid)
);

CREATE POLICY "Company members can upload cession documents"
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' AND
  name ~ '^company/[a-f0-9-]{36}/cessions/' AND
  user_belongs_to_company(auth.uid(), (regexp_matches(name, '^company/([a-f0-9-]{36})/cessions/'))[1]::uuid)
);

CREATE POLICY "Company members can update cession documents"
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' AND
  name ~ '^company/[a-f0-9-]{36}/cessions/' AND
  user_belongs_to_company(auth.uid(), (regexp_matches(name, '^company/([a-f0-9-]{36})/cessions/'))[1]::uuid)
);

CREATE POLICY "Company members can delete cession documents"
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'documents' AND
  name ~ '^company/[a-f0-9-]{36}/cessions/' AND
  user_belongs_to_company(auth.uid(), (regexp_matches(name, '^company/([a-f0-9-]{36})/cessions/'))[1]::uuid)
);