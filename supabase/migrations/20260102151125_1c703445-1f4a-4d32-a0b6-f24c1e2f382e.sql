-- Drop existing RESTRICTIVE policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create PERMISSIVE SELECT policy: users see own profile, admins see all
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Create PERMISSIVE INSERT policy: users can insert own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);