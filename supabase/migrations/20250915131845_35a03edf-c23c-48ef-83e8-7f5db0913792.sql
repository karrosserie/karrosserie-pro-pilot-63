-- Migration pour créer les tables de tracking utilisateur
-- Date: 2025-01-15
-- Description: Infrastructure complète pour le tracking des comportements utilisateurs

BEGIN;

-- Table principale des logs d'activité utilisateur
CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.company_info(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'form_interaction', 'business_action', 'error', 'abandon'
  event_category TEXT NOT NULL, -- 'navigation', 'form', 'business', 'system'
  event_name TEXT NOT NULL, -- nom spécifique de l'action
  page_url TEXT NOT NULL,
  component_name TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table des sessions utilisateur
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.company_info(id),
  session_id TEXT NOT NULL UNIQUE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  pages_visited INTEGER DEFAULT 0,
  actions_performed INTEGER DEFAULT 0,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table de progression dans les tunnels/funnels
CREATE TABLE public.user_funnel_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.company_info(id),
  session_id TEXT NOT NULL,
  funnel_name TEXT NOT NULL, -- 'create_client', 'create_vehicle', 'create_quote', etc.
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'started', -- 'started', 'completed', 'abandoned'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  form_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table des durées de visite par page
CREATE TABLE public.page_visit_durations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.company_info(id),
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  enter_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  exit_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  interactions_count INTEGER DEFAULT 0,
  scroll_depth_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table des erreurs et abandons
CREATE TABLE public.user_errors_abandons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES public.company_info(id),
  session_id TEXT NOT NULL,
  error_type TEXT NOT NULL, -- 'form_error', 'navigation_error', 'system_error', 'funnel_abandon'
  error_message TEXT,
  page_url TEXT NOT NULL,
  component_name TEXT,
  funnel_name TEXT,
  step_name TEXT,
  form_data JSONB DEFAULT '{}',
  stack_trace TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX idx_user_activity_logs_user_session ON public.user_activity_logs(user_id, session_id);
CREATE INDEX idx_user_activity_logs_timestamp ON public.user_activity_logs(timestamp);
CREATE INDEX idx_user_activity_logs_event_type ON public.user_activity_logs(event_type);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX idx_user_funnel_progress_funnel ON public.user_funnel_progress(user_id, funnel_name);
CREATE INDEX idx_page_visit_durations_user_page ON public.page_visit_durations(user_id, page_url);
CREATE INDEX idx_user_errors_abandons_user_session ON public.user_errors_abandons(user_id, session_id);

-- Trigger pour mettre à jour les sessions
CREATE OR REPLACE FUNCTION update_user_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le compteur de pages visitées et d'actions
  UPDATE public.user_sessions 
  SET 
    pages_visited = pages_visited + CASE WHEN NEW.event_type = 'page_view' THEN 1 ELSE 0 END,
    actions_performed = actions_performed + CASE WHEN NEW.event_type != 'page_view' THEN 1 ELSE 0 END,
    updated_at = NOW()
  WHERE session_id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_session
AFTER INSERT ON public.user_activity_logs
FOR EACH ROW
EXECUTE FUNCTION update_user_session();

-- RLS Policies
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_funnel_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visit_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_errors_abandons ENABLE ROW LEVEL SECURITY;

-- Policies pour user_activity_logs
CREATE POLICY "Users can manage their own activity logs" 
ON public.user_activity_logs 
FOR ALL 
USING (auth.uid() = user_id OR user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (auth.uid() = user_id);

-- Policies pour user_sessions
CREATE POLICY "Users can manage their own sessions" 
ON public.user_sessions 
FOR ALL 
USING (auth.uid() = user_id OR user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (auth.uid() = user_id);

-- Policies pour user_funnel_progress
CREATE POLICY "Users can manage their own funnel progress" 
ON public.user_funnel_progress 
FOR ALL 
USING (auth.uid() = user_id OR user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (auth.uid() = user_id);

-- Policies pour page_visit_durations
CREATE POLICY "Users can manage their own page visits" 
ON public.page_visit_durations 
FOR ALL 
USING (auth.uid() = user_id OR user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (auth.uid() = user_id);

-- Policies pour user_errors_abandons
CREATE POLICY "Users can manage their own errors and abandons" 
ON public.user_errors_abandons 
FOR ALL 
USING (auth.uid() = user_id OR user_belongs_to_company(auth.uid(), company_id))
WITH CHECK (auth.uid() = user_id);

COMMIT;