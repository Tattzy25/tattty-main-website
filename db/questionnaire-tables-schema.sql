-- Questionnaire and Session Analytics Tables Schema
-- Created: 2025-10-05

-- 1. Question 1 Skipped
CREATE TABLE IF NOT EXISTS q1_skipped (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Question 2 Skipped
CREATE TABLE IF NOT EXISTS q2_skipped (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Question 3 Skipped
CREATE TABLE IF NOT EXISTS q3_skipped (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Question 4 Skipped
CREATE TABLE IF NOT EXISTS q4_skipped (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Question 5 Skipped
CREATE TABLE IF NOT EXISTS q5_skipped (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Question 6 Skipped
CREATE TABLE IF NOT EXISTS q6_skipped (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Preset vs Text Usage
CREATE TABLE IF NOT EXISTS preset_vs_text_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  question_number INTEGER,
  input_type TEXT,
  preset_value TEXT,
  text_value TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Average Time Per Question
CREATE TABLE IF NOT EXISTS avg_time_per_question (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  question_number INTEGER,
  time_spent_ms INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Question 8 Followup Rate
CREATE TABLE IF NOT EXISTS q8_followup_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  followup_completed BOOLEAN DEFAULT false,
  followup_response TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. Steps Completed
CREATE TABLE IF NOT EXISTS steps_completed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  total_steps INTEGER,
  steps_completed INTEGER,
  completion_percentage DECIMAL(5,2),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 11. Session Length
CREATE TABLE IF NOT EXISTS session_length (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_ms INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 12. Completion Rate
CREATE TABLE IF NOT EXISTS completion_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  completed BOOLEAN DEFAULT false,
  completion_percentage DECIMAL(5,2),
  abandonment_stage TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 13. Free vs Paid Usage
CREATE TABLE IF NOT EXISTS free_vs_paid_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  user_type TEXT,
  feature_used TEXT,
  usage_count INTEGER DEFAULT 1,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
