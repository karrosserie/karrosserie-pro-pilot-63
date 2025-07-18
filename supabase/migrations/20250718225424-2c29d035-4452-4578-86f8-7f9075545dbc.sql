-- Mettre à jour la politique RLS pour permettre de voir les profils des membres désactivés
DROP POLICY IF EXISTS "Users can view company member profiles" ON profiles;

CREATE POLICY "Users can view company member profiles" 
ON profiles 
FOR SELECT 
USING (
  (auth.uid() = id) OR 
  (EXISTS ( 
    SELECT 1
    FROM (user_companies uc1
      JOIN user_companies uc2 ON ((uc1.company_id = uc2.company_id)))
    WHERE ((uc1.user_id = auth.uid()) AND (uc2.user_id = profiles.id) AND (uc1.active = true))
  ))
);