-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a CRON job to run the reschedule-pending-tasks function daily at 7:00 AM
SELECT cron.schedule(
  'reschedule-pending-tasks-daily',
  '0 7 * * *', -- Every day at 7:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/reschedule-pending-tasks',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MDkxMiwiZXhwIjoyMDYzNTY2OTEyfQ.oAfv1qzaA7gn7v7jAhFz8Kt7j6CvbIeI-89SNHG_1NM"}'::jsonb,
        body:='{"triggered_by": "cron", "timestamp": "' || now()::text || '"}'::jsonb
    ) as request_id;
  $$
);