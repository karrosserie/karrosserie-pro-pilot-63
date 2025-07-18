-- Rename user_preferences table to company_preferences
ALTER TABLE user_preferences RENAME TO company_preferences;

-- Drop the old user_id column and add company_id column
ALTER TABLE company_preferences DROP COLUMN user_id;
ALTER TABLE company_preferences ADD COLUMN company_id uuid NOT NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON company_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON company_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON company_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON company_preferences;

-- Create new RLS policies for company-based access
CREATE POLICY "Users can view company preferences if they belong to company" 
ON company_preferences 
FOR SELECT 
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Users can insert company preferences if they belong to company" 
ON company_preferences 
FOR INSERT 
WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Users can update company preferences if they belong to company" 
ON company_preferences 
FOR UPDATE 
USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Users can delete company preferences if they belong to company" 
ON company_preferences 
FOR DELETE 
USING (user_belongs_to_company(auth.uid(), company_id));