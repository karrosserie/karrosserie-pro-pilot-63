-- Créer une table pour stocker le dernier numéro de facture par company
CREATE TABLE IF NOT EXISTS public.invoice_sequences (
  company_id uuid PRIMARY KEY REFERENCES public.company_info(id) ON DELETE CASCADE,
  last_number integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.invoice_sequences ENABLE ROW LEVEL SECURITY;

-- Politique RLS
CREATE POLICY "Users can access their company sequences"
ON public.invoice_sequences
FOR ALL
USING (public.user_belongs_to_company(auth.uid(), company_id));

-- Fonction pour obtenir le prochain numéro de facture (atomique et sans race condition)
CREATE OR REPLACE FUNCTION public.get_next_invoice_number(p_company_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num integer;
  current_max integer;
BEGIN
  -- D'abord, récupérer le max actuel des factures existantes
  SELECT COALESCE(MAX(reference::integer), 0) INTO current_max
  FROM invoices 
  WHERE company_id = p_company_id 
    AND reference ~ '^[0-9]+$';
  
  -- Insérer ou mettre à jour le compteur de manière atomique avec UPSERT + lock
  INSERT INTO invoice_sequences (company_id, last_number, updated_at)
  VALUES (p_company_id, current_max + 1, now())
  ON CONFLICT (company_id) 
  DO UPDATE SET 
    last_number = GREATEST(invoice_sequences.last_number, EXCLUDED.last_number - 1) + 1,
    updated_at = now()
  RETURNING last_number INTO next_num;
  
  RETURN next_num;
END;
$$;

-- Initialiser les séquences pour toutes les companies existantes basé sur leurs factures
INSERT INTO invoice_sequences (company_id, last_number)
SELECT 
  company_id, 
  COALESCE(MAX(reference::integer), 0)
FROM invoices 
WHERE reference ~ '^[0-9]+$'
GROUP BY company_id
ON CONFLICT (company_id) DO UPDATE 
SET last_number = GREATEST(invoice_sequences.last_number, EXCLUDED.last_number);