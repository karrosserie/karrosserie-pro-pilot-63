-- Migration to remove employees table and use user_companies directly

-- Step 1: Add qualifications column to user_companies
ALTER TABLE public.user_companies 
ADD COLUMN qualifications JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate qualifications data from employees to user_companies
UPDATE public.user_companies uc
SET qualifications = e.qualifications
FROM public.employees e
WHERE uc.id = e.team_member_id;

-- Step 3: Update employee_schedule to use user_id instead of employee_id
-- First add the new column
ALTER TABLE public.employee_schedule 
ADD COLUMN user_id UUID;

-- Migrate the data
UPDATE public.employee_schedule es
SET user_id = uc.user_id
FROM public.employees e
JOIN public.user_companies uc ON uc.id = e.team_member_id
WHERE es.employee_id = e.id;

-- Make user_id not null and drop old column
ALTER TABLE public.employee_schedule 
ALTER COLUMN user_id SET NOT NULL,
DROP COLUMN employee_id;

-- Step 4: Update employee_timesheets to use user_id instead of employee_id
-- First add the new column
ALTER TABLE public.employee_timesheets 
ADD COLUMN user_id UUID;

-- Migrate the data
UPDATE public.employee_timesheets et
SET user_id = uc.user_id
FROM public.employees e
JOIN public.user_companies uc ON uc.id = e.team_member_id
WHERE et.employee_id = e.id;

-- Make user_id not null and drop old column
ALTER TABLE public.employee_timesheets 
ALTER COLUMN user_id SET NOT NULL,
DROP COLUMN employee_id;

-- Step 5: Drop the employees table
DROP TABLE public.employees;