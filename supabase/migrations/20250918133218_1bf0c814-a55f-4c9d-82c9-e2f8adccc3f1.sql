-- Fix the get_available_employees function to use correct enum values
CREATE OR REPLACE FUNCTION get_available_employees(p_company_id UUID, p_task_type TEXT)
RETURNS TABLE(user_id UUID, qualification TEXT, availability_score INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return employees with proper qualification matching, availability checking and scoring
  RETURN QUERY
  SELECT 
    uc.user_id,
    COALESCE(p.qualification, 'general') as qualification,
    CASE 
      -- Check if employee has required qualification for the task type
      WHEN p.qualification IS NOT NULL AND p.qualification ILIKE '%' || p_task_type || '%' THEN 10
      -- Check if employee is not currently busy with another task at the same time
      WHEN NOT EXISTS (
        SELECT 1 FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')  -- Use correct enum values
        AND es.start_datetime <= NOW() + INTERVAL '1 hour'
        AND es.end_datetime >= NOW()
      ) THEN 5
      -- Give priority to employees with fewer current tasks
      WHEN (
        SELECT COUNT(*) FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')  -- Use correct enum values
        AND DATE(es.start_datetime) = CURRENT_DATE
      ) = 0 THEN 8
      WHEN (
        SELECT COUNT(*) FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')  -- Use correct enum values
        AND DATE(es.start_datetime) = CURRENT_DATE
      ) <= 2 THEN 6
      WHEN (
        SELECT COUNT(*) FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')  -- Use correct enum values
        AND DATE(es.start_datetime) = CURRENT_DATE
      ) <= 4 THEN 4
      ELSE 2
    END as availability_score
  FROM user_companies uc
  LEFT JOIN profiles p ON p.id = uc.user_id
  WHERE uc.company_id = p_company_id 
    AND uc.active = true
  ORDER BY availability_score DESC, 
           CASE WHEN p.qualification IS NOT NULL AND p.qualification ILIKE '%' || p_task_type || '%' THEN 0 ELSE 1 END,
           uc.created_at ASC -- First joined employees get priority when scores are equal
  LIMIT 10; -- Return top 10 candidates
END;
$$;