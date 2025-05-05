-- Add price_range column to artist_profiles
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS price_range VARCHAR(20);

-- Add is_traveling_artist column to artist_profiles if it doesn't exist
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS is_traveling_artist BOOLEAN DEFAULT false;

-- Add service_radius column to artist_profiles
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 25;

-- Add latitude and longitude columns to artist_profiles
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create artist_travel_schedule table if it doesn't exist
CREATE TABLE IF NOT EXISTS artist_travel_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artist_availability table if it doesn't exist
CREATE TABLE IF NOT EXISTS artist_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on artist_id in artist_travel_schedule
CREATE INDEX IF NOT EXISTS idx_artist_travel_schedule_artist_id ON artist_travel_schedule(artist_id);

-- Create index on artist_id in artist_availability
CREATE INDEX IF NOT EXISTS idx_artist_availability_artist_id ON artist_availability(artist_id);

-- Create index on location in artist_profiles
CREATE INDEX IF NOT EXISTS idx_artist_profiles_location ON artist_profiles(location);

-- Create spatial index on latitude and longitude
CREATE INDEX IF NOT EXISTS idx_artist_profiles_lat_lng ON artist_profiles(latitude, longitude);
