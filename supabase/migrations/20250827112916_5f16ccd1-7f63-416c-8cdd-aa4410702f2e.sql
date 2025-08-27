-- Update Geoffrey's profile to admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'geoffrey.moya@gmail.com';