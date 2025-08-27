-- Fix security issues by first dropping dependent policies, then recreating functions with proper search_path

-- Drop all policies that depend on the functions we need to recreate
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete course files" ON storage.objects;

-- Now drop and recreate the functions with proper search_path
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
DROP FUNCTION IF EXISTS public.has_active_subscription(UUID);

-- Recreate security definer function to check user role with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS user_role 
SECURITY DEFINER 
SET search_path = public
LANGUAGE SQL 
STABLE AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$;

-- Recreate security definer function to check if user has active subscription with proper search_path
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN 
SECURITY DEFINER 
SET search_path = public
LANGUAGE SQL 
STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active' 
    AND current_period_end > now()
  );
$$;

-- Recreate admin policies with restricted access to authenticated users only
CREATE POLICY "Authenticated admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "Authenticated admins can manage all courses" ON public.courses
  FOR ALL TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "Authenticated admins can view all subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "Authenticated admins can upload course files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'course-files' AND 
    public.get_user_role() = 'admin'
  );

CREATE POLICY "Authenticated admins can update course files" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'course-files' AND 
    public.get_user_role() = 'admin'
  );

CREATE POLICY "Authenticated admins can delete course files" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'course-files' AND 
    public.get_user_role() = 'admin'
  );