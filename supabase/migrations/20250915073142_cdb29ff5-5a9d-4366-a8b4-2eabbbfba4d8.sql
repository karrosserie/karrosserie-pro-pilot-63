-- First, remove the existing CRON job with incorrect authentication
SELECT cron.unschedule('reschedule-pending-tasks-daily');

-- Create a corrected CRON job that uses the proper service role key
SELECT cron.schedule(
  'reschedule-pending-tasks-daily-fixed',
  '0 7 * * *', -- Every day at 7:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/reschedule-pending-tasks',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body:=jsonb_build_object(
          'triggered_by', 'cron',
          'timestamp', now()::text
        )
    ) as request_id;
  $$
);