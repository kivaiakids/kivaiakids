-- Fix security issues: Add search_path to functions and restrict policies to authenticated users

-- Drop and recreate security definer functions with proper search_path
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
DROP FUNCTION IF EXISTS public.has_active_subscription(UUID);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

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

-- Recreate handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public, auth
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

-- Recreate update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop existing policies that allow anonymous access
DROP POLICY IF EXISTS "Everyone can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Everyone can view course files" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

-- Create new policies restricted to authenticated users

-- Profiles policies (authenticated only)
CREATE POLICY "Authenticated users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Authenticated users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- Courses policies (public reading allowed for published courses, admin management)
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
  FOR SELECT USING (published = true);

-- Subscriptions policies (authenticated only)
CREATE POLICY "Authenticated users can view their own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Course progress policies (authenticated only)
CREATE POLICY "Authenticated users can view their own progress" ON public.course_progress
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert their own progress" ON public.course_progress
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own progress" ON public.course_progress
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Storage policies (public reading for course files and avatars, authenticated uploads)
CREATE POLICY "Course files are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-files');

CREATE POLICY "Avatars are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload their own avatar" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Authenticated users can update their own avatar" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );