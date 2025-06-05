
-- Create receipts table
CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  reference TEXT,
  date DATE NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'En attente',
  payment_method TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  notes TEXT,
  payment_proofs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own receipts" ON public.receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receipts" ON public.receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts" ON public.receipts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipts" ON public.receipts
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS receipts_user_id_idx ON public.receipts(user_id);
CREATE INDEX IF NOT EXISTS receipts_invoice_id_idx ON public.receipts(invoice_id);
CREATE INDEX IF NOT EXISTS receipts_date_idx ON public.receipts(date);
CREATE INDEX IF NOT EXISTS receipts_status_idx ON public.receipts(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_receipts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_receipts_updated_at();
