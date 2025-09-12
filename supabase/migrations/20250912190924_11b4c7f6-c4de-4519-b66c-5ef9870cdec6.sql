-- Make employee-tasks bucket public and add policies allowing company-scoped uploads
-- 1) Ensure bucket is public for easy image viewing
UPDATE storage.buckets SET public = true WHERE id = 'employee-tasks';

-- 2) Policies for storage.objects on employee-tasks bucket
-- Allow INSERT only if file path starts with the effective company id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'employee_tasks_insert_company_folder'
  ) THEN
    CREATE POLICY employee_tasks_insert_company_folder
    ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'employee-tasks'
      AND (storage.foldername(name))[1] = public.get_effective_company_id()::text
    );
  END IF;
END $$;

-- Allow UPDATE only within same company folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'employee_tasks_update_company_folder'
  ) THEN
    CREATE POLICY employee_tasks_update_company_folder
    ON storage.objects
    FOR UPDATE TO authenticated
    USING (
      bucket_id = 'employee-tasks'
      AND (storage.foldername(name))[1] = public.get_effective_company_id()::text
    )
    WITH CHECK (
      bucket_id = 'employee-tasks'
      AND (storage.foldername(name))[1] = public.get_effective_company_id()::text
    );
  END IF;
END $$;

-- Allow DELETE only within same company folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'employee_tasks_delete_company_folder'
  ) THEN
    CREATE POLICY employee_tasks_delete_company_folder
    ON storage.objects
    FOR DELETE TO authenticated
    USING (
      bucket_id = 'employee-tasks'
      AND (storage.foldername(name))[1] = public.get_effective_company_id()::text
    );
  END IF;
END $$;

-- Optional: allow SELECT to authenticated users for their company files (bucket is public, but keep for safety in case public flag changes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'employee_tasks_select_company_folder'
  ) THEN
    CREATE POLICY employee_tasks_select_company_folder
    ON storage.objects
    FOR SELECT TO authenticated
    USING (
      bucket_id = 'employee-tasks'
      AND (
        (storage.foldername(name))[1] = public.get_effective_company_id()::text
      )
    );
  END IF;
END $$;
