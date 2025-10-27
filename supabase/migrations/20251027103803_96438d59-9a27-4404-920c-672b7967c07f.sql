-- Create employee work time tracking table
CREATE TABLE employee_work_time_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES company_info(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_work_minutes INTEGER NOT NULL DEFAULT 0,
  current_task_id UUID NULL REFERENCES employee_schedule(id) ON DELETE SET NULL,
  current_task_start TIMESTAMPTZ NULL,
  is_currently_working BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_employee_daily_tracking UNIQUE(user_id, company_id, date)
);

-- Indexes for performance
CREATE INDEX idx_employee_work_time_user_date ON employee_work_time_tracking(user_id, date);
CREATE INDEX idx_employee_work_time_company_date ON employee_work_time_tracking(company_id, date);

-- Enable RLS
ALTER TABLE employee_work_time_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Company members can view employee work time"
  ON employee_work_time_tracking FOR SELECT
  USING (user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Company members can manage employee work time"
  ON employee_work_time_tracking FOR ALL
  USING (user_belongs_to_company(auth.uid(), company_id))
  WITH CHECK (user_belongs_to_company(auth.uid(), company_id));

-- Function to update employee work time automatically
CREATE OR REPLACE FUNCTION update_employee_work_time()
RETURNS TRIGGER AS $$
DECLARE
  work_duration INTEGER;
  task_date DATE;
BEGIN
  -- Determine task date
  task_date := DATE(NEW.real_start_datetime);
  
  -- If task just started (real_start_datetime just set)
  IF NEW.real_start_datetime IS NOT NULL AND OLD.real_start_datetime IS NULL THEN
    -- Insert or update tracking record
    INSERT INTO employee_work_time_tracking (
      user_id,
      company_id,
      date,
      current_task_id,
      current_task_start,
      is_currently_working
    ) VALUES (
      NEW.user_id,
      NEW.company_id,
      task_date,
      NEW.id,
      NEW.real_start_datetime,
      true
    )
    ON CONFLICT (user_id, company_id, date) 
    DO UPDATE SET
      current_task_id = NEW.id,
      current_task_start = NEW.real_start_datetime,
      is_currently_working = true,
      updated_at = now();
      
  -- If task just finished (real_end_datetime just set)
  ELSIF NEW.real_end_datetime IS NOT NULL AND OLD.real_end_datetime IS NULL THEN
    -- Calculate work duration in minutes
    work_duration := EXTRACT(EPOCH FROM (NEW.real_end_datetime - NEW.real_start_datetime)) / 60;
    
    -- Update total time
    UPDATE employee_work_time_tracking
    SET 
      total_work_minutes = total_work_minutes + work_duration,
      is_currently_working = false,
      current_task_id = NULL,
      current_task_start = NULL,
      updated_at = now()
    WHERE user_id = NEW.user_id 
      AND company_id = NEW.company_id 
      AND date = task_date;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER track_employee_work_time
  AFTER UPDATE ON employee_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_employee_work_time();

-- Create view for easy queries
CREATE OR REPLACE VIEW employee_work_time_summary AS
SELECT 
  ewt.user_id,
  ewt.company_id,
  ewt.date,
  ewt.total_work_minutes,
  ewt.is_currently_working,
  ewt.current_task_id,
  ewt.current_task_start,
  -- Calculate current time including ongoing task
  CASE 
    WHEN ewt.is_currently_working AND ewt.current_task_start IS NOT NULL THEN
      ewt.total_work_minutes + EXTRACT(EPOCH FROM (now() - ewt.current_task_start)) / 60
    ELSE
      ewt.total_work_minutes
  END as current_total_minutes,
  -- Format as hours and minutes
  CASE 
    WHEN ewt.is_currently_working AND ewt.current_task_start IS NOT NULL THEN
      CONCAT(
        FLOOR((ewt.total_work_minutes + EXTRACT(EPOCH FROM (now() - ewt.current_task_start)) / 60) / 60)::TEXT, 
        'h ', 
        MOD(FLOOR(ewt.total_work_minutes + EXTRACT(EPOCH FROM (now() - ewt.current_task_start)) / 60)::INTEGER, 60)::TEXT,
        'min'
      )
    ELSE
      CONCAT(
        FLOOR(ewt.total_work_minutes / 60)::TEXT, 
        'h ', 
        MOD(ewt.total_work_minutes::INTEGER, 60)::TEXT,
        'min'
      )
  END as formatted_duration,
  p.first_name || ' ' || p.last_name as employee_name,
  es.task_type as current_task_type,
  es.vehicle_id as current_vehicle_id,
  v.license_plate as current_vehicle_plate
FROM employee_work_time_tracking ewt
LEFT JOIN profiles p ON p.id = ewt.user_id
LEFT JOIN employee_schedule es ON es.id = ewt.current_task_id
LEFT JOIN vehicles v ON v.id = es.vehicle_id;