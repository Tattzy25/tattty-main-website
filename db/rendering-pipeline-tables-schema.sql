-- Rendering and Pipeline Tables Schema
-- Created: 2025-10-05

-- 1. OS120 to Diffuse Status
CREATE TABLE IF NOT EXISTS os120_to_diffuse_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  status TEXT,
  status_code INTEGER,
  error_message TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Diffuse to Control Status
CREATE TABLE IF NOT EXISTS diffuse_to_control_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  status TEXT,
  status_code INTEGER,
  error_message TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Handoff Total Latency
CREATE TABLE IF NOT EXISTS handoff_total_latency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  os120_to_diffuse_ms INTEGER,
  diffuse_to_control_ms INTEGER,
  total_latency_ms INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Render Resolution
CREATE TABLE IF NOT EXISTS render_resolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  width INTEGER,
  height INTEGER,
  resolution_category TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Render Quality Score
CREATE TABLE IF NOT EXISTS render_quality_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  quality_score DECIMAL(5,2),
  quality_metrics JSONB,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
