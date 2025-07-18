-- Remove user_id column from company_info table as we now use user_companies for the relationship
ALTER TABLE public.company_info 
DROP COLUMN user_id;