-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE issue_status AS ENUM ('reported', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE issue_category AS ENUM ('roads', 'water', 'electricity', 'garbage', 'streetlights', 'drainage', 'parks', 'other');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  citizen_score INTEGER DEFAULT 0,
  total_reports INTEGER DEFAULT 0,
  resolved_reports INTEGER DEFAULT 0,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issues table
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category issue_category NOT NULL,
  status issue_status DEFAULT 'reported',
  priority issue_priority DEFAULT 'medium',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  photo_url TEXT,
  video_url TEXT,
  voice_note_url TEXT,
  upvotes INTEGER DEFAULT 0,
  department_assigned TEXT,
  assigned_to UUID,
  estimated_resolution_date DATE,
  actual_resolution_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issue updates table for tracking progress
CREATE TABLE public.issue_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  update_text TEXT NOT NULL,
  status issue_status,
  updated_by UUID REFERENCES auth.users(id),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gamification tables
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_required INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  availability_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for issues
CREATE POLICY "Users can view all issues" ON public.issues
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own issues" ON public.issues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issues" ON public.issues
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for issue updates
CREATE POLICY "Users can view all issue updates" ON public.issue_updates
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issue updates" ON public.issue_updates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for rewards
CREATE POLICY "Anyone can view rewards" ON public.rewards
  FOR SELECT USING (true);

-- Create RLS policies for user rewards
CREATE POLICY "Users can view their own redeemed rewards" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem rewards" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, points_required) VALUES
('First Reporter', 'Report your first civic issue', '🎯', 0),
('Community Helper', 'Report 10 civic issues', '🤝', 50),
('Civic Champion', 'Report 50 civic issues', '🏆', 250),
('Neighborhood Hero', 'Report 100 civic issues', '🦸', 500),
('City Guardian', 'Report 500 civic issues', '🛡️', 2500);

-- Insert sample rewards
INSERT INTO public.rewards (name, description, points_cost, availability_count) VALUES
('Bus Pass (1 Month)', 'Free public transport for 1 month', 100, 1000),
('Property Tax Discount (5%)', '5% discount on next property tax payment', 200, 500),
('Municipal Services Priority', 'Priority handling for municipal service requests', 300, 200),
('Certificate of Recognition', 'Official recognition certificate from municipality', 150, 1000),
('Tree Planting Kit', 'Free kit to plant trees in your neighborhood', 75, 2000);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('issue-photos', 'issue-photos', true),
  ('issue-videos', 'issue-videos', true),
  ('voice-notes', 'voice-notes', true),
  ('avatars', 'avatars', true);

-- Create storage policies
CREATE POLICY "Public can view issue photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-photos');

CREATE POLICY "Authenticated users can upload issue photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public can view issue videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-videos');

CREATE POLICY "Authenticated users can upload issue videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view voice notes" ON storage.objects
  FOR SELECT USING (bucket_id = 'voice-notes' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can upload voice notes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'voice-notes' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);