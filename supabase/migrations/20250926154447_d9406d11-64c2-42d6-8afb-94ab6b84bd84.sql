-- Mettre à jour les coordonnées GPS de l'entreprise Youcef Djabou
UPDATE company_info 
SET 
  latitude = 43.26630315844424,
  longitude = 5.394204739469882,
  updated_at = NOW()
WHERE id = '60c3ff7b-5a9b-4cbd-865f-1f8cf850efd3';