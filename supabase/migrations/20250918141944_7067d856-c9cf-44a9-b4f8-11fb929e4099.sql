-- Supprimer l'ancienne fonction et recréer avec la bonne structure
DROP FUNCTION IF EXISTS public.get_available_employees(uuid, text);

CREATE OR REPLACE FUNCTION public.get_available_employees(p_company_id uuid, p_task_type text)
 RETURNS TABLE(user_id uuid, qualifications jsonb, availability_score integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Return employees with proper qualification matching, availability checking and scoring
  RETURN QUERY
  SELECT 
    uc.user_id,
    COALESCE(uc.qualifications, '[]'::jsonb) as qualifications,
    CASE 
      -- Check if employee has required qualification for the task type
      WHEN uc.qualifications IS NOT NULL AND uc.qualifications @> format('["%s"]', p_task_type)::jsonb THEN 10
      -- Check if employee is not currently busy with another task at the same time
      WHEN NOT EXISTS (
        SELECT 1 FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')
        AND es.start_datetime <= NOW() + INTERVAL '1 hour'
        AND es.end_datetime >= NOW()
      ) THEN 5
      -- Give priority to employees with fewer current tasks
      WHEN (
        SELECT COUNT(*) FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')
        AND DATE(es.start_datetime) = CURRENT_DATE
      ) = 0 THEN 8
      WHEN (
        SELECT COUNT(*) FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')
        AND DATE(es.start_datetime) = CURRENT_DATE
      ) <= 2 THEN 6
      WHEN (
        SELECT COUNT(*) FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')
        AND DATE(es.start_datetime) = CURRENT_DATE
      ) <= 4 THEN 4
      ELSE 2
    END as availability_score
  FROM user_companies uc
  WHERE uc.company_id = p_company_id 
    AND uc.active = true
  ORDER BY availability_score DESC, 
           CASE WHEN uc.qualifications IS NOT NULL AND uc.qualifications @> format('["%s"]', p_task_type)::jsonb THEN 0 ELSE 1 END,
           uc.created_at ASC
  LIMIT 10;
END;
$function$