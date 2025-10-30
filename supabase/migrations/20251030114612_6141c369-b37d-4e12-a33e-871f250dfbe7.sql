-- Add urgency notes field to employee_schedule
ALTER TABLE public.employee_schedule 
ADD COLUMN IF NOT EXISTS urgency_notes TEXT;

-- Add comment
COMMENT ON COLUMN public.employee_schedule.urgency_notes IS 'Explanatory notes for emergency tasks describing what needs to be done';