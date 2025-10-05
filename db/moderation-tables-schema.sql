-- Content Moderation Tables Schema
-- Created: 2025-10-05

-- 1. Total Blocks
CREATE TABLE IF NOT EXISTS total_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  block_reason TEXT,
  blocked_content TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Reason Gang Symbols
CREATE TABLE IF NOT EXISTS reason_gang_symbols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  detected_symbol TEXT,
  confidence_score DECIMAL(5,2),
  blocked BOOLEAN DEFAULT true,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Reason Cultural Appropriation
CREATE TABLE IF NOT EXISTS reason_cultural_appropriation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  cultural_element TEXT,
  confidence_score DECIMAL(5,2),
  blocked BOOLEAN DEFAULT true,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Reason Extreme Violence
CREATE TABLE IF NOT EXISTS reason_extreme_violence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  violence_type TEXT,
  confidence_score DECIMAL(5,2),
  blocked BOOLEAN DEFAULT true,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Reason False Positive
CREATE TABLE IF NOT EXISTS reason_false_positive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  original_block_reason TEXT,
  reported_by_user BOOLEAN DEFAULT false,
  reviewed BOOLEAN DEFAULT false,
  reviewer_notes TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
