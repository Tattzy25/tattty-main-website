-- API Cost and Error Tracking Tables Schema
-- Created: 2025-10-05

-- 1. API Cost Per Generation
CREATE TABLE IF NOT EXISTS api_cost_per_generation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  total_cost DECIMAL(10,4),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. API Cost GPT
CREATE TABLE IF NOT EXISTS api_cost_gpt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  model_name TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost DECIMAL(10,4),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. API Cost Diffusion
CREATE TABLE IF NOT EXISTS api_cost_diffusion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  model_name TEXT,
  image_count INTEGER,
  resolution TEXT,
  cost DECIMAL(10,4),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. API Cost Control
CREATE TABLE IF NOT EXISTS api_cost_control (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  control_type TEXT,
  model_name TEXT,
  cost DECIMAL(10,4),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Peak Usage Times
CREATE TABLE IF NOT EXISTS peak_usage_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hour_of_day INTEGER,
  day_of_week INTEGER,
  request_count INTEGER DEFAULT 1,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Error Rate By API
CREATE TABLE IF NOT EXISTS error_rate_by_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_type TEXT,
  error_count INTEGER DEFAULT 1,
  total_requests INTEGER,
  error_rate DECIMAL(5,2),
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Error Rate LLM API
CREATE TABLE IF NOT EXISTS error_rate_llm_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  model_name TEXT,
  error_type TEXT,
  error_message TEXT,
  status_code INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Error Rate Diffusion API
CREATE TABLE IF NOT EXISTS error_rate_diffusion_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  model_name TEXT,
  error_type TEXT,
  error_message TEXT,
  status_code INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Error Rate Control API
CREATE TABLE IF NOT EXISTS error_rate_control_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID,
  control_type TEXT,
  error_type TEXT,
  error_message TEXT,
  status_code INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
