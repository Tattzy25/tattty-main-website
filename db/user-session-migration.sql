-- User Session and Journey Tracking Tables
-- Stores complete user journey for tattoo questionnaire
-- NO FALLBACKS - All data must be present
-- Uses existing user_sessions table structure

-- Complete User Journey Tracking System
-- Comprehensive data collection for tattoo generation pipeline
-- Tracks everything: answers, selections, timing, costs, errors

-- Enhanced session answers with comprehensive tracking
CREATE TABLE IF NOT EXISTS session_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    question_id UUID NOT NULL,
    step_number INTEGER NOT NULL,
    answer_text TEXT,
    selected_options JSONB DEFAULT '[]',
    time_spent_seconds INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    skipped BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(session_id, question_id),
    CONSTRAINT valid_step CHECK (step_number > 0),
    CONSTRAINT valid_time CHECK (time_spent_seconds >= 0)
);

-- Card 7 style selections with tracking
CREATE TABLE IF NOT EXISTS session_style_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- style, color, size, placement
    selected_option_id UUID NOT NULL,
    selected_option_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    time_to_select_seconds INTEGER DEFAULT 0,
    selection_order INTEGER DEFAULT 1,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_id, category),
    CONSTRAINT valid_category CHECK (category IN ('style', 'color', 'size', 'placement'))
);

-- Card 8 AI questions with generation tracking
CREATE TABLE IF NOT EXISTS session_ai_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    ai_question TEXT NOT NULL,
    user_answer TEXT,
    generation_time_ms INTEGER NOT NULL,
    groq_tokens_used INTEGER DEFAULT 0,
    groq_cost_usd DECIMAL(10,6) DEFAULT 0,
    generation_model VARCHAR(100) DEFAULT 'groq/llama3-70b',
    retry_count INTEGER DEFAULT 0,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(session_id)
);

-- Session timing and performance tracking
CREATE TABLE IF NOT EXISTS session_timing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL, -- 'question_1', 'card_7', 'ai_generation', etc
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Generation cost tracking per session
CREATE TABLE IF NOT EXISTS session_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    service VARCHAR(50) NOT NULL, -- 'groq', 'stability', 'pexels'
    operation VARCHAR(100) NOT NULL, -- 'follow_up_question', 'final_prompts', 'image_generation'
    tokens_used INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 1,
    cost_usd DECIMAL(10,6) NOT NULL,
    model_used VARCHAR(100),
    success BOOLEAN DEFAULT TRUE,
    charged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error tracking per session step
CREATE TABLE IF NOT EXISTS session_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    error_type VARCHAR(50) NOT NULL, -- 'AI_GENERATION', 'API_CALL', 'VALIDATION'
    error_message TEXT NOT NULL,
    error_stack TEXT,
    context JSONB DEFAULT '{}',
    retry_attempt INTEGER DEFAULT 0,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_errors_session_id ON session_errors(session_id);
CREATE INDEX IF NOT EXISTS idx_session_errors_type ON session_errors(error_type);

-- Uploaded reference images tracking
CREATE TABLE IF NOT EXISTS session_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_uploads_session_id ON session_uploads(session_id);
CREATE INDEX IF NOT EXISTS idx_session_uploads_date ON session_uploads(uploaded_at);

-- Complete session summary (final state)
CREATE TABLE IF NOT EXISTS session_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
    complete_prompt TEXT NOT NULL,
    style_prompt TEXT NOT NULL,
    user_journey JSONB NOT NULL,
    generation_config JSONB NOT NULL,
    total_cost_usd DECIMAL(10,6) DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    styles_selected INTEGER DEFAULT 0,
    errors_encountered INTEGER DEFAULT 0,
    final_rating INTEGER, -- User satisfaction 1-5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_id)
);

-- Indexes for performance and analytics
CREATE INDEX IF NOT EXISTS idx_session_answers_session_id ON session_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_session_answers_step ON session_answers(step_number);
CREATE INDEX IF NOT EXISTS idx_session_answers_timing ON session_answers(answered_at);
CREATE INDEX IF NOT EXISTS idx_session_style_selections_session_id ON session_style_selections(session_id);
CREATE INDEX IF NOT EXISTS idx_session_style_selections_category ON session_style_selections(category);
CREATE INDEX IF NOT EXISTS idx_session_ai_questions_session_id ON session_ai_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_timing_session_step ON session_timing(session_id, step_name);
CREATE INDEX IF NOT EXISTS idx_session_costs_session_service ON session_costs(session_id, service);
CREATE INDEX IF NOT EXISTS idx_session_costs_service_date ON session_costs(service, charged_at);
CREATE INDEX IF NOT EXISTS idx_session_errors_session_type ON session_errors(session_id, error_type);
CREATE INDEX IF NOT EXISTS idx_session_errors_type_date ON session_errors(error_type, occurred_at);
CREATE INDEX IF NOT EXISTS idx_session_summaries_session_id ON session_summaries(session_id);
CREATE INDEX IF NOT EXISTS idx_session_summaries_cost ON session_summaries(total_cost_usd);
CREATE INDEX IF NOT EXISTS idx_session_summaries_rating ON session_summaries(final_rating);

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();