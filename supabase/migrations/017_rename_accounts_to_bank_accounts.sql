
-- Rename accounts table to bank_accounts
ALTER TABLE public.accounts RENAME TO bank_accounts;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can insert their own accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can update their own accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can delete their own accounts" ON public.bank_accounts;

-- Create new RLS policies with updated names
CREATE POLICY "Users can view their own bank accounts" ON public.bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts" ON public.bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts" ON public.bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts" ON public.bank_accounts
  FOR DELETE USING (auth.uid() = user_id);
