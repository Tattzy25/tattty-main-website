-- User Interaction and Pipeline Tables Schema
-- Created: 2025-10-05

-- 1. Render Display Time
CREATE TABLE IF NOT EXISTS render_display_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  display_start_time TIMESTAMP,
  display_end_time TIMESTAMP,
  display_duration_ms INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Preview Interactions
CREATE TABLE IF NOT EXISTS preview_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  interaction_type TEXT,
  interaction_count INTEGER DEFAULT 1,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Share Triggered
CREATE TABLE IF NOT EXISTS share_triggered (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  share_platform TEXT,
  share_successful BOOLEAN DEFAULT false,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Pipeline Stage
CREATE TABLE IF NOT EXISTS pipeline_stage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  stage_name TEXT,
  stage_order INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Pipeline Status
CREATE TABLE IF NOT EXISTS pipeline_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  stage_name TEXT,
  status TEXT,
  error_message TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Pipeline Duration MS
CREATE TABLE IF NOT EXISTS pipeline_duration_ms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  stage_name TEXT,
  duration_ms INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Image Storage Size MB
CREATE TABLE IF NOT EXISTS image_storage_size_mb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  generation_id UUID,
  image_url TEXT,
  file_size_mb DECIMAL(10,4),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Retention Days
CREATE TABLE IF NOT EXISTS retention_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  generation_id UUID,
  image_url TEXT,
  retention_days INTEGER,
  expiry_date TIMESTAMP,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Cleanup Flag
CREATE TABLE IF NOT EXISTS cleanup_flag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  generation_id UUID,
  image_url TEXT,
  flagged_for_cleanup BOOLEAN DEFAULT false,
  cleanup_reason TEXT,
  cleanup_date TIMESTAMP,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
