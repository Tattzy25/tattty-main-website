-- Core Database Schema for Tattoo Generation App
-- Created: 2025-10-05

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password_hash TEXT,
  email_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- User Tiers/Subscriptions
CREATE TABLE IF NOT EXISTS user_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMP DEFAULT NOW(),
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_tiers_user_id ON user_tiers(user_id);
CREATE INDEX idx_user_tiers_subscription_tier ON user_tiers(subscription_tier);

-- User Transactions/Payments
CREATE TABLE IF NOT EXISTS user_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  transaction_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  stripe_payment_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON user_transactions(user_id);
CREATE INDEX idx_transactions_status ON user_transactions(status);
CREATE INDEX idx_transactions_created_at ON user_transactions(created_at);

-- Tattoo Generation Results
CREATE TABLE IF NOT EXISTS tattoo_generation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID,
  batch_id UUID,
  prompt_text TEXT,
  final_prompt TEXT,
  status TEXT DEFAULT 'processing',
  image_url TEXT,
  blob_url TEXT,
  model_used TEXT,
  generation_params JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_generation_user_id ON tattoo_generation_results(user_id);
CREATE INDEX idx_generation_status ON tattoo_generation_results(status);
CREATE INDEX idx_generation_created_at ON tattoo_generation_results(created_at);
CREATE INDEX idx_generation_batch_id ON tattoo_generation_results(batch_id);

-- User Token Usage
CREATE TABLE IF NOT EXISTS user_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES tattoo_generation_results(id) ON DELETE SET NULL,
  tokens_used INTEGER NOT NULL,
  token_type TEXT,
  cost DECIMAL(10,4),
  model_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_token_usage_user_id ON user_token_usage(user_id);
CREATE INDEX idx_token_usage_generation_id ON user_token_usage(generation_id);
CREATE INDEX idx_token_usage_created_at ON user_token_usage(created_at);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- User Logins (for activity tracking)
CREATE TABLE IF NOT EXISTS user_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  login_date TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logins_user_id ON user_logins(user_id);
CREATE INDEX idx_logins_date ON user_logins(login_date);

-- Tattoo Designs (saved designs)
CREATE TABLE IF NOT EXISTS tattoo_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES tattoo_generation_results(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  blob_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_designs_user_id ON tattoo_designs(user_id);
CREATE INDEX idx_designs_created_at ON tattoo_designs(created_at);
CREATE INDEX idx_designs_is_public ON tattoo_designs(is_public);

-- User Stories
CREATE TABLE IF NOT EXISTS user_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  story_content TEXT NOT NULL,
  story_summary TEXT,
  tags TEXT[],
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stories_user_id ON user_stories(user_id);
CREATE INDEX idx_stories_created_at ON user_stories(created_at);

-- Content Moderation Queue
CREATE TABLE IF NOT EXISTS content_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  moderation_result JSONB,
  flagged_reason TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_moderation_status ON content_moderation(status);
CREATE INDEX idx_moderation_user_id ON content_moderation(user_id);
CREATE INDEX idx_moderation_created_at ON content_moderation(created_at);