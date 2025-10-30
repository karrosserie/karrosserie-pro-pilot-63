-- Add is_emergency flag to employee_schedule
ALTER TABLE public.employee_schedule 
ADD COLUMN IF NOT EXISTS is_emergency BOOLEAN DEFAULT false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_employee_schedule_is_emergency 
ON public.employee_schedule(is_emergency) 
WHERE is_emergency = true;

-- Add comment
COMMENT ON COLUMN public.employee_schedule.is_emergency IS 'Flag to identify emergency tasks that should not follow the normal workflow';