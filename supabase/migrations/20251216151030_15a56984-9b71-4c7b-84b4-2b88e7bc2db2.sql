-- Add atelier_status column to repair_orders for detailed workshop status tracking
ALTER TABLE public.repair_orders 
ADD COLUMN IF NOT EXISTS atelier_status TEXT DEFAULT 'entree_atelier';

-- Add comment for documentation
COMMENT ON COLUMN public.repair_orders.atelier_status IS 'Detailed workshop status: entree_atelier, attente_expertise, expertise_planifiee, expertise_effectuee, attente_pieces, en_reparation, termine, rdv_restitution, cloture';