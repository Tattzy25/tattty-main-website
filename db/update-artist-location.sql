-- Add location fields to artist_profiles table
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS is_traveling_artist BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 25, -- in kilometers
ADD COLUMN IF NOT EXISTS available_locations TEXT[] DEFAULT '{}';

-- Create index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_artist_profiles_location ON artist_profiles (latitude, longitude);

-- Create a table for artist travel schedule if they're traveling artists
CREATE TABLE IF NOT EXISTS artist_travel_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artist_profiles(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for artist travel schedule
CREATE INDEX IF NOT EXISTS idx_artist_travel_schedule_artist_id ON artist_travel_schedule (artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_travel_schedule_dates ON artist_travel_schedule (start_date, end_date);
