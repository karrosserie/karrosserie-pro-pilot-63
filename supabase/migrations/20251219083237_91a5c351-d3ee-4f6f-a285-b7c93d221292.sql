-- Ajouter les colonnes pour la réservation temporaire
ALTER TABLE public.invoice_sequences 
ADD COLUMN IF NOT EXISTS reserved_number integer,
ADD COLUMN IF NOT EXISTS reserved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reserved_by uuid;

-- Fonction pour réserver un numéro (à l'ouverture du formulaire)
CREATE OR REPLACE FUNCTION public.reserve_invoice_number(p_company_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_num integer;
  current_max integer;
  existing_reserved integer;
BEGIN
  -- Récupérer le max actuel des factures existantes
  SELECT COALESCE(MAX(reference::integer), 0) INTO current_max
  FROM invoices 
  WHERE company_id = p_company_id 
    AND reference ~ '^[0-9]+$';
  
  -- Vérifier s'il y a déjà une réservation pour cette company
  SELECT reserved_number INTO existing_reserved
  FROM invoice_sequences
  WHERE company_id = p_company_id
    AND reserved_number IS NOT NULL
    AND reserved_at > NOW() - INTERVAL '30 minutes'; -- Réservations expirées après 30 min
  
  -- Si réservation existante valide, prendre le numéro suivant
  IF existing_reserved IS NOT NULL THEN
    next_num := GREATEST(current_max, existing_reserved) + 1;
  ELSE
    -- Sinon, prendre le max + 1
    SELECT GREATEST(COALESCE(last_number, 0), current_max) + 1 INTO next_num
    FROM invoice_sequences
    WHERE company_id = p_company_id;
    
    -- Si aucune entrée n'existe
    IF next_num IS NULL THEN
      next_num := current_max + 1;
    END IF;
  END IF;
  
  -- Insérer ou mettre à jour la réservation
  INSERT INTO invoice_sequences (company_id, last_number, reserved_number, reserved_at, reserved_by, updated_at)
  VALUES (p_company_id, current_max, next_num, now(), auth.uid(), now())
  ON CONFLICT (company_id) 
  DO UPDATE SET 
    reserved_number = next_num,
    reserved_at = now(),
    reserved_by = auth.uid(),
    updated_at = now();
  
  RETURN next_num;
END;
$$;

-- Fonction pour confirmer le numéro après création réussie
CREATE OR REPLACE FUNCTION public.confirm_invoice_number(p_company_id uuid, p_number integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Mettre à jour last_number et effacer la réservation
  UPDATE invoice_sequences 
  SET 
    last_number = GREATEST(COALESCE(last_number, 0), p_number),
    reserved_number = NULL,
    reserved_at = NULL,
    reserved_by = NULL,
    updated_at = now()
  WHERE company_id = p_company_id;
  
  RETURN true;
END;
$$;

-- Fonction pour libérer un numéro réservé (annulation)
CREATE OR REPLACE FUNCTION public.release_invoice_number(p_company_id uuid, p_number integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Libérer la réservation seulement si c'est le même numéro
  UPDATE invoice_sequences 
  SET 
    reserved_number = NULL,
    reserved_at = NULL,
    reserved_by = NULL,
    updated_at = now()
  WHERE company_id = p_company_id 
    AND reserved_number = p_number;
  
  RETURN true;
END;
$$;