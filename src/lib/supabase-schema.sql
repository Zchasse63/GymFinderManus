// This file contains SQL commands to set up the Supabase database schema for the Gym Finder application

-- Create tables for the Gym Finder application

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Amenities table
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gyms table
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  coordinates POINT NOT NULL,
  rating DECIMAL(3, 1),
  review_count INTEGER DEFAULT 0,
  price_range TEXT,
  hours TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'flagged')),
  place_id TEXT
);

-- Gym Categories junction table
CREATE TABLE gym_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, category_id)
);

-- Gym Amenities junction table
CREATE TABLE gym_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, amenity_id)
);

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'gym_owner', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('published', 'pending', 'rejected'))
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  amenities_confirmed JSONB DEFAULT '{}',
  amenities_missing TEXT[] DEFAULT '{}',
  is_accurate BOOLEAN DEFAULT TRUE,
  inaccuracy_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
-- Run these in the SQL editor in Supabase dashboard

-- For gym images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gym-images', 'Gym Images', true);

-- For user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'User Avatars', true);

-- Create RLS policies
-- These policies control access to the data

-- Gyms table policies
CREATE POLICY "Public gyms are viewable by everyone" 
ON gyms FOR SELECT USING (status = 'verified');

CREATE POLICY "Gym owners can update their own gyms" 
ON gyms FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can update any gym" 
ON gyms FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Gym owners can insert their own gyms" 
ON gyms FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can insert any gym" 
ON gyms FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Reviews table policies
CREATE POLICY "Published reviews are viewable by everyone" 
ON reviews FOR SELECT USING (status = 'published');

CREATE POLICY "Users can see their own reviews" 
ON reviews FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Gym owners can see reviews for their gyms" 
ON reviews FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM gyms 
    WHERE gyms.id = reviews.gym_id AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can see all reviews" 
ON reviews FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Users can insert their own reviews" 
ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback table policies
CREATE POLICY "Users can insert their own feedback" 
ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can see all feedback" 
ON feedback FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Gym owners can see feedback for their gyms" 
ON feedback FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM gyms 
    WHERE gyms.id = feedback.gym_id AND gyms.owner_id = auth.uid()
  )
);

-- Messages table policies
CREATE POLICY "Users can see messages they sent or received" 
ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

CREATE POLICY "Users can insert messages they send" 
ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received" 
ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Storage policies
CREATE POLICY "Anyone can view gym images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gym-images');

CREATE POLICY "Gym owners can upload gym images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gym-images' AND
  (
    EXISTS (
      SELECT 1 FROM gyms
      WHERE gyms.id::text = SPLIT_PART(storage.objects.name, '/', 1)
      AND gyms.owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
);

CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  SPLIT_PART(storage.objects.name, '.', 1) = auth.uid()::text
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Insert initial data

-- Categories
INSERT INTO categories (name, icon) VALUES
('Corporate', 'Building2'),
('Local', 'Store'),
('CrossFit', 'Dumbbell'),
('Recovery', 'Waves'),
('Studio', 'Sparkles'),
('Yoga', 'Yoga'),
('Pilates', 'Bed'),
('Group', 'Users'),
('Cycling', 'Bike');

-- Amenities
INSERT INTO amenities (name, icon) VALUES
('24-Hour Access', 'Clock'),
('Towel Service', 'Droplet'),
('Sauna', 'Flame'),
('Hot Tub', 'Droplets'),
('Cold Plunge', 'Snowflake'),
('Cafe', 'Coffee'),
('WiFi', 'Wifi'),
('Co-Working Space', 'Briefcase'),
('Free Weights', 'Dumbbell'),
('Machines', 'Cog'),
('Cardio Equipment', 'Heart'),
('Functional Training', 'Activity'),
('Olympic Lifting', 'Barbell'),
('Personal Training', 'User'),
('Group Classes', 'Users'),
('Massage', 'Hand'),
('Childcare', 'Baby'),
('Nutrition Coaching', 'Apple');

-- Create functions for updating gym ratings
CREATE OR REPLACE FUNCTION update_gym_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE gyms
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,1)
      FROM reviews
      WHERE gym_id = NEW.gym_id
      AND status = 'published'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE gym_id = NEW.gym_id
      AND status = 'published'
    ),
    updated_at = NOW()
  WHERE id = NEW.gym_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gym_rating_on_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION update_gym_rating();

CREATE TRIGGER update_gym_rating_on_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
WHEN (OLD.status <> 'published' AND NEW.status = 'published')
EXECUTE FUNCTION update_gym_rating();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
