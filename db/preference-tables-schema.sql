-- Preference Tables Schema
-- Created: 2025-10-05

-- 1. Style Preference
CREATE TABLE IF NOT EXISTS style_preference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  style_name TEXT,
  preference_score INTEGER,
  selected BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Color Preference
CREATE TABLE IF NOT EXISTS color_preference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  color_name TEXT,
  color_hex TEXT,
  preference_score INTEGER,
  selected BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Placement Preference
CREATE TABLE IF NOT EXISTS placement_preference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  placement_area TEXT,
  preference_score INTEGER,
  selected BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Size Preference
CREATE TABLE IF NOT EXISTS size_preference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  size_category TEXT,
  size_inches TEXT,
  preference_score INTEGER,
  selected BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
