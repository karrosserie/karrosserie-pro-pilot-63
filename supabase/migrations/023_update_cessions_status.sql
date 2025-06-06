
-- Update cessions status constraint to include all new status values

-- Remove the old constraint
ALTER TABLE public.cessions 
DROP CONSTRAINT IF EXISTS cessions_status_check;

-- Add the new constraint with all status values
ALTER TABLE public.cessions 
ADD CONSTRAINT cessions_status_check 
CHECK (status IN (
  'en_attente',
  'en_attente_signature', 
  'signee',
  'signature_refusee',
  'lettre_recommandee_envoyee',
  'lettre_recommandee_recue',
  'lettre_recommandee_non_recuperee',
  'lettre_recommandee_refusee',
  'lettre_recommandee_presentee',
  'payee'
));
