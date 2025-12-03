-- Add columns for task splitting support
ALTER TABLE employee_schedule ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES employee_schedule(id) ON DELETE SET NULL;
ALTER TABLE employee_schedule ADD COLUMN IF NOT EXISTS part_number INTEGER DEFAULT 1;
ALTER TABLE employee_schedule ADD COLUMN IF NOT EXISTS total_parts INTEGER DEFAULT 1;
ALTER TABLE employee_schedule ADD COLUMN IF NOT EXISTS total_duration_minutes INTEGER;
ALTER TABLE employee_schedule ADD COLUMN IF NOT EXISTS is_splittable BOOLEAN DEFAULT false;

-- Add index for faster lookup of related parts
CREATE INDEX IF NOT EXISTS idx_employee_schedule_parent_task_id ON employee_schedule(parent_task_id);

-- Comment on columns for documentation
COMMENT ON COLUMN employee_schedule.parent_task_id IS 'Reference to the first part of a split task (null for Part 1 or non-split tasks)';
COMMENT ON COLUMN employee_schedule.part_number IS 'Part number in a split task sequence (1, 2, 3...)';
COMMENT ON COLUMN employee_schedule.total_parts IS 'Total number of parts for this task';
COMMENT ON COLUMN employee_schedule.total_duration_minutes IS 'Original total duration in minutes before splitting';
COMMENT ON COLUMN employee_schedule.is_splittable IS 'Whether this task type can be split across days';