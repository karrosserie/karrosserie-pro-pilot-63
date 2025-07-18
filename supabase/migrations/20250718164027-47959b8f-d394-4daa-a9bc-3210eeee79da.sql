-- Create user_companies junction table to allow multiple users per company
CREATE TABLE public.user_companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  company_id uuid NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- Create policies for user_companies
CREATE POLICY "Users can view company members if they belong to the company" 
ON public.user_companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_companies uc 
    WHERE uc.company_id = user_companies.company_id 
    AND uc.user_id = auth.uid()
  )
);

CREATE POLICY "Company owners can manage team members" 
ON public.user_companies 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.company_info ci 
    WHERE ci.id = user_companies.company_id 
    AND ci.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_info ci 
    WHERE ci.id = user_companies.company_id 
    AND ci.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_companies_updated_at
BEFORE UPDATE ON public.user_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add invitations table for team member invitations
CREATE TABLE public.team_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  company_id uuid NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  UNIQUE(email, company_id)
);

-- Enable Row Level Security for invitations
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for team invitations
CREATE POLICY "Company owners can manage invitations" 
ON public.team_invitations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.company_info ci 
    WHERE ci.id = team_invitations.company_id 
    AND ci.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_info ci 
    WHERE ci.id = team_invitations.company_id 
    AND ci.user_id = auth.uid()
  )
);