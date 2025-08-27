-- Create custom functions to wrap PostgreSQL session parameter functions
CREATE OR REPLACE FUNCTION public.set_config(setting_name text, setting_value text, is_local boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
END;
$function$;

CREATE OR REPLACE FUNCTION public.current_setting(setting_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  result text;
BEGIN
  BEGIN
    SELECT current_setting(setting_name, true) INTO result;
    RETURN COALESCE(result, '');
  EXCEPTION
    WHEN OTHERS THEN
      RETURN '';
  END;
END;
$function$;