
-- Create company_info table
CREATE TABLE IF NOT EXISTS public.company_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    zipCode TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    siren TEXT NOT NULL DEFAULT '',
    siret TEXT NOT NULL DEFAULT '',
    tva TEXT NOT NULL DEFAULT '',
    logo_url TEXT,
    notifications JSONB NOT NULL DEFAULT '{"email": true, "push": true, "sms": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own company info" ON public.company_info
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company info" ON public.company_info
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company info" ON public.company_info
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own company info" ON public.company_info
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_company_info_user_id ON public.company_info(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_company_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
CREATE TRIGGER update_company_info_updated_at_trigger
    BEFORE UPDATE ON public.company_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_company_info_updated_at();
