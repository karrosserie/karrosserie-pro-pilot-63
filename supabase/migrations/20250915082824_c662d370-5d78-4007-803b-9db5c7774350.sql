-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests (if not already enabled) 
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to reschedule pending tasks every weekday at 7:00 AM
SELECT cron.schedule(
  'reschedule-pending-tasks-daily',
  '0 7 * * 1-5', -- At 7:00 AM, Monday through Friday
  $$
  SELECT
    net.http_post(
      url := 'https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/reschedule-pending-tasks',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDkxMiwiZXAiOjIwNjM1NjY5MTJ9.3QX1qmqGeqIEjjzsQGJ39BZ7Xxu2X12eQ5fs8wZA5f8'
      ),
      body := jsonb_build_object(
        'scheduled_execution', true,
        'execution_time', now()
      )
    ) as request_id;
  $$
);