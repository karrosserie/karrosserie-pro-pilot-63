-- Create function to get available employees for a specific task type
CREATE OR REPLACE FUNCTION get_available_employees(p_company_id UUID, p_task_type TEXT)
RETURNS TABLE(user_id UUID, qualification TEXT, availability_score INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  -- For now, return all active employees of the company
  -- Later this can be enhanced with qualifications and availability logic
  RETURN QUERY
  SELECT 
    uc.user_id,
    COALESCE(p.qualification, 'general') as qualification,
    1 as availability_score
  FROM user_companies uc
  LEFT JOIN profiles p ON p.id = uc.user_id
  WHERE uc.company_id = p_company_id 
    AND uc.active = true
  ORDER BY availability_score DESC;
END;
$$;