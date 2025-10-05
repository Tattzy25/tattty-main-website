-- Prompt Analytics Tables Schema
-- Created: 2025-10-05

-- 1. Prompt Build Success
CREATE TABLE IF NOT EXISTS prompt_build_success (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  build_successful BOOLEAN DEFAULT false,
  build_error TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Prompt Length Tokens
CREATE TABLE IF NOT EXISTS prompt_length_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  prompt_text TEXT,
  token_count INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Prompt Tone Type
CREATE TABLE IF NOT EXISTS prompt_tone_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  tone_type TEXT,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Prompt to Diffuse Latency
CREATE TABLE IF NOT EXISTS prompt_to_diffuse_latency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID,
  generation_id UUID,
  prompt_build_time_ms INTEGER,
  diffusion_start_time_ms INTEGER,
  total_latency_ms INTEGER,
  date_recorded TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
