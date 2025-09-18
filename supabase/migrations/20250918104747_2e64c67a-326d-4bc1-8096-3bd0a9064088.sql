-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the overdue tasks rescheduling function to run every hour
SELECT cron.schedule(
  'reschedule-overdue-tasks',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://ffqepwdgikwvrsftchwa.supabase.co/functions/v1/reschedule-overdue-tasks',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcWVwd2RnaWt3dnJzZnRjaHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NDA5NzQsImV4cCI6MjA0MTIxNjk3NH0.0W1wjn6vJcFH8KcPOZyBYfqGpTvSPE6Sv7LoySx5xXg"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule the auto assignment function to run every 30 minutes
SELECT cron.schedule(
  'auto-assign-priority-tasks',
  '*/30 * * * *', -- Every 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://ffqepwdgikwvrsftchwa.supabase.co/functions/v1/auto-assign-next-task',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcWVwd2RnaWt3dnJzZnRjaHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NDA5NzQsImV4cCI6MjA0MTIxNjk3NH0.0W1wjn6vJcFH8KcPOZyBYfqGpTvSPE6Sv7LoySx5xXg"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);