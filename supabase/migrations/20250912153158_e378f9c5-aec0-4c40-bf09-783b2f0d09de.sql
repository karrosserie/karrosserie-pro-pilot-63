-- Fix ambiguous column reference in calculate_repair_order_surface
CREATE OR REPLACE FUNCTION public.calculate_repair_order_surface(repair_order_id uuid)
RETURNS numeric
LANGUAGE plpgsql
AS $function$
DECLARE
  total_surface NUMERIC := 0;
  vehicle_id UUID;
BEGIN
  -- Récupérer le vehicle_id du repair_order
  SELECT ro.vehicle_id INTO vehicle_id
  FROM public.repair_orders ro
  WHERE ro.id = repair_order_id;
  
  -- Si pas de véhicule associé, retourner 0
  IF vehicle_id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculer la somme des surfaces de toutes les pièces en nommant explicitement la colonne de l'unnest
  SELECT COALESCE(SUM(vps.surface_m2), 0) INTO total_surface
  FROM public.repair_orders ro
  CROSS JOIN LATERAL unnest(ro.pieces_array) AS u(piece_name)
  LEFT JOIN public.body_parts bp ON bp.name = u.piece_name
  LEFT JOIN public.vehicle_part_surfaces vps ON vps.vehicle_id = ro.vehicle_id AND vps.body_part_id = bp.id
  WHERE ro.id = repair_order_id;
  
  -- Si certaines surfaces ne sont pas en cache, utiliser les surfaces de base
  IF total_surface = 0 THEN
    SELECT COALESCE(SUM(bp.base_surface_m2), 0) INTO total_surface
    FROM public.repair_orders ro
    CROSS JOIN LATERAL unnest(ro.pieces_array) AS u(piece_name)
    LEFT JOIN public.body_parts bp ON bp.name = u.piece_name
    WHERE ro.id = repair_order_id;
  END IF;
  
  RETURN total_surface;
END;
$function$;