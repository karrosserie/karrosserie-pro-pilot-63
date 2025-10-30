-- Add interrupted_by column to employee_schedule to track tasks interrupted by emergencies
ALTER TABLE employee_schedule 
ADD COLUMN interrupted_by uuid REFERENCES employee_schedule(id) ON DELETE SET NULL;

-- Create index for better performance when querying interrupted tasks
CREATE INDEX idx_employee_schedule_interrupted_by ON employee_schedule(interrupted_by) WHERE interrupted_by IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN employee_schedule.interrupted_by IS 'References the emergency task that caused this task to be interrupted/paused';