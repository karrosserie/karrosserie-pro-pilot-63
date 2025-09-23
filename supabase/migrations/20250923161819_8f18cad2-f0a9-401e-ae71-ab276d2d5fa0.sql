-- Enable realtime for employee_schedule table to listen for detailed_instructions updates
ALTER TABLE public.employee_schedule REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.employee_schedule;