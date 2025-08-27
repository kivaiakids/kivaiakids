-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'student');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- Create enum for course categories
CREATE TYPE public.course_category AS ENUM ('mathematiques', 'sciences', 'langues', 'histoire', 'geographie', 'arts', 'sport', 'informatique');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category course_category NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  file_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL, -- 'monthly' or 'yearly'
  status subscription_status NOT NULL DEFAULT 'trial',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course_progress table
CREATE TABLE public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active' 
    AND current_period_end > now()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "Public can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Courses policies
CREATE POLICY "Everyone can view published courses" ON public.courses
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (public.get_user_role() = 'admin');

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "System can insert subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update subscriptions" ON public.subscriptions
  FOR UPDATE USING (true);

-- Course progress policies
CREATE POLICY "Users can view their own progress" ON public.course_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress" ON public.course_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON public.course_progress
  FOR UPDATE USING (user_id = auth.uid());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-files', 'course-files', true),
  ('avatars', 'avatars', true);

-- Storage policies for course files
CREATE POLICY "Admins can upload course files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-files' AND 
    public.get_user_role() = 'admin'
  );

CREATE POLICY "Everyone can view course files" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-files');

CREATE POLICY "Admins can update course files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'course-files' AND 
    public.get_user_role() = 'admin'
  );

CREATE POLICY "Admins can delete course files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'course-files' AND 
    public.get_user_role() = 'admin'
  );

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Everyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();