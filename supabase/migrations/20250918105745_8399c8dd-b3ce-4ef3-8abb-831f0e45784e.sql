-- Remove the auto-assign-next-task cron job as it's no longer needed
SELECT cron.unschedule('auto-assign-priority-tasks');

-- Update the reschedule-overdue-tasks cron job to run more frequently (every 30 minutes)
-- since it now handles automatic insertion and shifting
SELECT cron.unschedule('reschedule-overdue-tasks');

SELECT cron.schedule(
  'reschedule-overdue-tasks-with-shifting',
  '*/30 * * * *', -- Every 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/reschedule-overdue-tasks',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTA5MTIsImV4cCI6MjA2MzU2NjkxMn0.fJcqL0Sg_x7AXacC6lhqic-VWhvI46D3tFgRcpgchxo"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);