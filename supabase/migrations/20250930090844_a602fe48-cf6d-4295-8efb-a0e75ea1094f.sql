-- Mise à jour de la fonction get_available_employees pour inclure la qualification "Contrôle technique de sécurité"

CREATE OR REPLACE FUNCTION public.get_available_employees(p_company_id uuid, p_task_type text)
 RETURNS TABLE(user_id uuid, qualifications jsonb, availability_score integer, role_priority integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  qualification_key text;
BEGIN
  -- Mapper les types de tâches vers les clés de qualification
  qualification_key := CASE p_task_type
    WHEN 'Accueil & Préparation du dossier' THEN 'accueil'
    WHEN 'Remplacement ou débosselage' THEN 'remplacement'
    WHEN 'Contrôle technique de sécurité' THEN 'controle'
    WHEN 'Préparation peinture' THEN 'preparation'
    WHEN 'Mise en peinture' THEN 'peinture'
    WHEN 'Finitions & remontage' THEN 'finitions'
    WHEN 'Clôture & livraison' THEN 'cloture'
    ELSE lower(p_task_type) -- fallback
  END;

  -- Return ONLY employees who are qualified for the specific task type
  RETURN QUERY
  SELECT 
    uc.user_id,
    COALESCE(uc.qualifications, '[]'::jsonb) as qualifications,
    CASE 
      -- Check if employee is not currently busy with another task at the same time
      WHEN NOT EXISTS (
        SELECT 1 FROM employee_schedule es 
        WHERE es.user_id = uc.user_id 
        AND es.company_id = p_company_id
        AND es.status IN ('En cours', 'En attente')
        AND es.start_datetime <= NOW() + INTERVAL '1 hour'
        AND es.end_datetime >= NOW()
      ) THEN 10
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
    END as availability_score,
    -- Score de priorité basé sur le rôle
    CASE 
      WHEN uc.role = 'Employé' THEN 100
      WHEN uc.role = 'Employé véhicule de courtoisie' THEN 90
      WHEN uc.role = 'carrossier' THEN 95
      WHEN uc.role = 'carrossier-vehicule de courtoisie' THEN 85
      WHEN uc.role = 'Manager' THEN 60
      WHEN uc.role = 'Propriétaire' THEN 50
      ELSE 30
    END as role_priority
  FROM user_companies uc
  WHERE uc.company_id = p_company_id 
    AND uc.active = true
    -- CONDITION CRITIQUE: Ne retourner QUE les employés qui ont la qualification requise
    AND uc.qualifications IS NOT NULL 
    AND uc.qualifications @> format('["%s"]', qualification_key)::jsonb
  ORDER BY 
    -- D'abord par priorité de rôle (employés en premier)
    role_priority DESC,
    -- Ensuite par score de disponibilité
    availability_score DESC,
    -- Enfin par ancienneté (plus ancien en premier)
    uc.created_at ASC
  LIMIT 10;
END;
$function$;