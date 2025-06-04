
-- Create credits table
CREATE TABLE credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente', 'Payé', 'Annulé')),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  items_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(user_id, reference)
);

-- Enable RLS
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits" ON credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credits" ON credits
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON credits
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Create indexes for better performance
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_credits_client_id ON credits(client_id);
CREATE INDEX idx_credits_vehicle_id ON credits(vehicle_id);
CREATE INDEX idx_credits_invoice_id ON credits(invoice_id);
CREATE INDEX idx_credits_status ON credits(status);
CREATE INDEX idx_credits_created_at ON credits(created_at);
