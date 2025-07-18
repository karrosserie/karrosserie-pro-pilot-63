-- Update existing role from 'admin' to 'Propriétaire' for backward compatibility
UPDATE public.user_companies 
SET role = 'Propriétaire' 
WHERE role = 'admin';

-- Update any other old roles to match new system
UPDATE public.user_companies 
SET role = 'Responsable' 
WHERE role = 'manager';

UPDATE public.user_companies 
SET role = 'Gestionnaire de réservation' 
WHERE role = 'reservation_manager';

UPDATE public.user_companies 
SET role = 'Gestionnaire d''inventaire' 
WHERE role = 'inventory_manager';