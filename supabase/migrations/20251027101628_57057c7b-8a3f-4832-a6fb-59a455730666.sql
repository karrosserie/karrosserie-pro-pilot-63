-- Créer la table de tracking du temps de travail des véhicules
CREATE TABLE IF NOT EXISTS public.vehicle_work_time_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.company_info(id) ON DELETE CASCADE,
  total_work_minutes INTEGER NOT NULL DEFAULT 0,
  last_task_start TIMESTAMPTZ NULL,
  is_currently_working BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_vehicle_tracking UNIQUE(vehicle_id, company_id)
);

-- Index pour la performance
CREATE INDEX IF NOT EXISTS idx_vehicle_work_time_vehicle_id ON public.vehicle_work_time_tracking(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_work_time_company_id ON public.vehicle_work_time_tracking(company_id);

-- Activer RLS
ALTER TABLE public.vehicle_work_time_tracking ENABLE ROW LEVEL SECURITY;

-- Politique pour que les membres de l'entreprise puissent voir le temps de travail
CREATE POLICY "Company members can view vehicle work time"
  ON public.vehicle_work_time_tracking FOR SELECT
  USING (user_belongs_to_company(auth.uid(), company_id));

-- Politique pour que les membres de l'entreprise puissent gérer le temps de travail
CREATE POLICY "Company members can manage vehicle work time"
  ON public.vehicle_work_time_tracking FOR ALL
  USING (user_belongs_to_company(auth.uid(), company_id))
  WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Fonction pour mettre à jour automatiquement le temps de travail
CREATE OR REPLACE FUNCTION public.update_vehicle_work_time()
RETURNS TRIGGER AS $$
DECLARE
  work_duration INTEGER;
BEGIN
  -- Si la tâche vient de démarrer (real_start_datetime vient d'être défini)
  IF NEW.real_start_datetime IS NOT NULL AND OLD.real_start_datetime IS NULL THEN
    -- Insérer ou mettre à jour l'enregistrement de tracking
    INSERT INTO public.vehicle_work_time_tracking (
      vehicle_id,
      company_id,
      last_task_start,
      is_currently_working
    ) VALUES (
      NEW.vehicle_id,
      NEW.company_id,
      NEW.real_start_datetime,
      true
    )
    ON CONFLICT (vehicle_id, company_id) 
    DO UPDATE SET
      last_task_start = NEW.real_start_datetime,
      is_currently_working = true,
      updated_at = now();
      
  -- Si la tâche vient de se terminer (real_end_datetime vient d'être défini)
  ELSIF NEW.real_end_datetime IS NOT NULL AND OLD.real_end_datetime IS NULL THEN
    -- Calculer la durée de travail en minutes
    work_duration := EXTRACT(EPOCH FROM (NEW.real_end_datetime - NEW.real_start_datetime)) / 60;
    
    -- Mettre à jour le temps total
    UPDATE public.vehicle_work_time_tracking
    SET 
      total_work_minutes = total_work_minutes + work_duration,
      is_currently_working = false,
      last_task_start = NULL,
      updated_at = now()
    WHERE vehicle_id = NEW.vehicle_id 
      AND company_id = NEW.company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer le trigger
DROP TRIGGER IF EXISTS track_vehicle_work_time ON public.employee_schedule;
CREATE TRIGGER track_vehicle_work_time
  AFTER UPDATE ON public.employee_schedule
  FOR EACH ROW
  WHEN (NEW.vehicle_id IS NOT NULL)
  EXECUTE FUNCTION public.update_vehicle_work_time();

-- Créer la vue pour faciliter les requêtes
CREATE OR REPLACE VIEW public.vehicle_work_time_summary AS
SELECT 
  vwt.vehicle_id,
  vwt.company_id,
  vwt.total_work_minutes,
  vwt.is_currently_working,
  vwt.last_task_start,
  -- Calculer le temps en cours si une tâche est en cours
  CASE 
    WHEN vwt.is_currently_working AND vwt.last_task_start IS NOT NULL THEN
      vwt.total_work_minutes + EXTRACT(EPOCH FROM (now() - vwt.last_task_start)) / 60
    ELSE
      vwt.total_work_minutes
  END as current_total_minutes,
  -- Formater en heures et minutes
  CASE 
    WHEN vwt.is_currently_working AND vwt.last_task_start IS NOT NULL THEN
      CONCAT(
        FLOOR((vwt.total_work_minutes + EXTRACT(EPOCH FROM (now() - vwt.last_task_start)) / 60) / 60)::TEXT, 
        'h ', 
        MOD(FLOOR(vwt.total_work_minutes + EXTRACT(EPOCH FROM (now() - vwt.last_task_start)) / 60)::INTEGER, 60)::TEXT,
        'min'
      )
    ELSE
      CONCAT(
        FLOOR(vwt.total_work_minutes / 60)::TEXT, 
        'h ', 
        MOD(vwt.total_work_minutes::INTEGER, 60)::TEXT,
        'min'
      )
  END as formatted_duration,
  v.license_plate,
  v.status as vehicle_status
FROM public.vehicle_work_time_tracking vwt
LEFT JOIN public.vehicles v ON v.id = vwt.vehicle_id;