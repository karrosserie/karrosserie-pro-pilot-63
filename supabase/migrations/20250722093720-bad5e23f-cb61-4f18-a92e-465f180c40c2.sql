-- Recreate bank_accounts table
CREATE TABLE public.bank_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  bank text NOT NULL,
  iban text NOT NULL,
  bic text NOT NULL,
  balance decimal(15,2) DEFAULT 0.00,
  type text DEFAULT 'Courant' CHECK (type IN ('Courant', 'Épargne', 'Professionnel')),
  status text DEFAULT 'Actif' CHECK (status IN ('Actif', 'Inactif', 'Suspendu')),
  last_sync timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.bank_accounts ENABLE row level security;

-- Create RLS policies
CREATE POLICY "Users can view their own bank accounts" ON public.bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts" ON public.bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts" ON public.bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts" ON public.bank_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at 
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW 
  EXECUTE PROCEDURE moddatetime(updated_at);

-- Create indexes for better performance
CREATE INDEX idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_status ON public.bank_accounts(status);
CREATE INDEX idx_bank_accounts_type ON public.bank_accounts(type);