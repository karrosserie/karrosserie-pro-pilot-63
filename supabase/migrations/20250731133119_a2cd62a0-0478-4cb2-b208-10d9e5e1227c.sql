-- Supprimer l'ancienne contrainte de clé étrangère
ALTER TABLE public.bridge 
DROP CONSTRAINT IF EXISTS bridge_account_id_fkey;

-- Recréer la contrainte avec ON DELETE SET NULL
ALTER TABLE public.bridge 
ADD CONSTRAINT bridge_account_id_fkey 
FOREIGN KEY (account_id) 
REFERENCES public.bank_accounts(id) 
ON DELETE SET NULL;