-- User Behavior and Engagement Tables Schema
-- Created: 2025-10-05

-- 1. Restart Rate
CREATE TABLE IF NOT EXISTS restart_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  restarted BOOLEAN DEFAULT false,
  restart_stage TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Save to Community Rate
CREATE TABLE IF NOT EXISTS save_to_community_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  saved_to_community BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Download Rate
CREATE TABLE IF NOT EXISTS download_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  downloaded BOOLEAN DEFAULT false,
  download_format TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Return User Rate
CREATE TABLE IF NOT EXISTS return_user_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  first_visit TIMESTAMP,
  last_visit TIMESTAMP,
  visit_count INTEGER DEFAULT 1,
  days_since_first_visit INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. User Rating Average
CREATE TABLE IF NOT EXISTS user_rating_avg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  generation_id UUID,
  rating INTEGER,
  rating_comment TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Regeneration Rate
CREATE TABLE IF NOT EXISTS regeneration_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  original_generation_id UUID,
  regeneration_count INTEGER DEFAULT 1,
  regeneration_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Reported Issue Rate
CREATE TABLE IF NOT EXISTS reported_issue_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  issue_type TEXT,
  issue_description TEXT,
  resolved BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
