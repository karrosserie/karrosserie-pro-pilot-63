
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
CREATE INDEX IF NOT EXISTS idx_company_info_user_id ON public.company_info(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_company_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
DROP TRIGGER IF EXISTS update_company_info_updated_at_trigger ON public.company_info;
CREATE TRIGGER update_company_info_updated_at_trigger
    BEFORE UPDATE ON public.company_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_company_info_updated_at();

-- Create helper functions for the service
CREATE OR REPLACE FUNCTION public.get_company_info(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    email TEXT,
    address TEXT,
    zipCode TEXT,
    city TEXT,
    phone TEXT,
    siren TEXT,
    siret TEXT,
    tva TEXT,
    logo_url TEXT,
    notifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.id,
        ci.user_id,
        ci.name,
        ci.email,
        ci.address,
        ci.zipCode,
        ci.city,
        ci.phone,
        ci.siren,
        ci.siret,
        ci.tva,
        ci.logo_url,
        ci.notifications,
        ci.created_at,
        ci.updated_at
    FROM public.company_info ci
    WHERE ci.user_id = p_user_id AND auth.uid() = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create upsert function
CREATE OR REPLACE FUNCTION public.upsert_company_info(
    user_id UUID,
    name TEXT,
    email TEXT,
    address TEXT,
    zipCode TEXT,
    city TEXT,
    phone TEXT,
    siren TEXT,
    siret TEXT,
    tva TEXT,
    logo_url TEXT DEFAULT NULL,
    notifications JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    email TEXT,
    address TEXT,
    zipCode TEXT,
    city TEXT,
    phone TEXT,
    siren TEXT,
    siret TEXT,
    tva TEXT,
    logo_url TEXT,
    notifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    IF auth.uid() != upsert_company_info.user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    RETURN QUERY
    INSERT INTO public.company_info (
        user_id, name, email, address, zipCode, city, phone, siren, siret, tva, logo_url, notifications, updated_at
    ) VALUES (
        upsert_company_info.user_id,
        upsert_company_info.name,
        upsert_company_info.email,
        upsert_company_info.address,
        upsert_company_info.zipCode,
        upsert_company_info.city,
        upsert_company_info.phone,
        upsert_company_info.siren,
        upsert_company_info.siret,
        upsert_company_info.tva,
        upsert_company_info.logo_url,
        upsert_company_info.notifications,
        upsert_company_info.updated_at
    )
    ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        address = EXCLUDED.address,
        zipCode = EXCLUDED.zipCode,
        city = EXCLUDED.city,
        phone = EXCLUDED.phone,
        siren = EXCLUDED.siren,
        siret = EXCLUDED.siret,
        tva = EXCLUDED.tva,
        logo_url = EXCLUDED.logo_url,
        notifications = EXCLUDED.notifications,
        updated_at = EXCLUDED.updated_at
    RETURNING 
        company_info.id,
        company_info.user_id,
        company_info.name,
        company_info.email,
        company_info.address,
        company_info.zipCode,
        company_info.city,
        company_info.phone,
        company_info.siren,
        company_info.siret,
        company_info.tva,
        company_info.logo_url,
        company_info.notifications,
        company_info.created_at,
        company_info.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create delete function
CREATE OR REPLACE FUNCTION public.delete_company_info(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    DELETE FROM public.company_info WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
