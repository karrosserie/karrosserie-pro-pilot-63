-- Create RLS policies for remonté_demande_document table

-- Allow company members to view their document requests
CREATE POLICY "Company members can view their document requests"
ON "remonté_demande_document"
FOR SELECT
USING (user_belongs_to_company(auth.uid(), company_id));

-- Allow service role to insert document requests
CREATE POLICY "Service role can insert document requests"
ON "remonté_demande_document"
FOR INSERT
WITH CHECK (true);

-- Allow company members to delete their document requests
CREATE POLICY "Company members can delete their document requests"
ON "remonté_demande_document"
FOR DELETE
USING (user_belongs_to_company(auth.uid(), company_id));