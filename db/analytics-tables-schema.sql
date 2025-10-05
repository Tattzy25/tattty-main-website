-- Analytics Tables Schema
-- Created: 2025-10-05

-- 1. Generation Success Rate
CREATE TABLE IF NOT EXISTS generation_success_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  success_count INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Retry Frequency
CREATE TABLE IF NOT EXISTS retry_frequency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  retry_count INTEGER DEFAULT 0,
  original_generation_id UUID,
  retry_reason TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Stencil Success Rate
CREATE TABLE IF NOT EXISTS stencil_success_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stencil_id UUID,
  success_count INTEGER DEFAULT 0,
  total_uses INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Average Generation Time
CREATE TABLE IF NOT EXISTS average_generation_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  time_taken_ms INTEGER,
  model_used TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Generation Fail Reason
CREATE TABLE IF NOT EXISTS generation_fail_reason (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  fail_reason TEXT,
  error_code TEXT,
  error_message TEXT,
  user_id UUID,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Model Name
CREATE TABLE IF NOT EXISTS model_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL UNIQUE,
  model_version TEXT,
  provider TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Average Token Usage
CREATE TABLE IF NOT EXISTS avg_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  model_name TEXT,
  tokens_used INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  cost_estimate DECIMAL(10,4),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Control Parameters Version
CREATE TABLE IF NOT EXISTS control_params_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number TEXT NOT NULL UNIQUE,
  params JSONB,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
