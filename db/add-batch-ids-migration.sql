-- Migration: Add batch_id column to questions table
-- Date: October 5, 2025
-- Purpose: Store batch assignment for each question instead of computing at runtime

-- Add batch_id column to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS batch_id VARCHAR(50);

-- Create index for batch_id lookups
CREATE INDEX IF NOT EXISTS idx_questions_batch_id ON questions(batch_id, is_active);

-- Update questions with batch assignments
-- Batch A: Set1 Cards 1-3 + Set2 Cards 1-3 (braided: S1-1, S2-1, S1-2, S2-2, S1-3, S2-3)
-- Batch B: Set2 Cards 1-3 + Set1 Cards 1-3 (braided: S2-1, S1-1, S2-2, S1-2, S2-3, S1-3)
-- Batch C: Set1 Cards 4-6 + Set2 Cards 4-6 (braided: S1-4, S2-4, S1-5, S2-5, S1-6, S2-6)
-- Batch D: Set2 Cards 4-6 + Set1 Cards 4-6 (braided: S2-4, S1-4, S2-5, S1-5, S2-6, S1-6)

-- Batch A assignments
UPDATE questions 
SET batch_id = 'batch-a-s1-first-s2-first'
WHERE set_id = '550e8400-e29b-41d4-a716-446655440000' 
AND card_number IN (1, 2, 3);

UPDATE questions 
SET batch_id = 'batch-a-s1-first-s2-first'
WHERE set_id = '550e8400-e29b-41d4-a716-446655440001' 
AND card_number IN (1, 2, 3);

-- Batch B assignments (same cards, different batch)
-- Set up composite batch assignments - each question can belong to multiple batches
-- We'll use a junction table for this

-- Create batch_assignments table for many-to-many relationship
CREATE TABLE IF NOT EXISTS batch_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    batch_id VARCHAR(50) NOT NULL,
    position INTEGER NOT NULL, -- Position in the batch (1-6)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_id, batch_id)
);

-- Create index for efficient batch lookups
CREATE INDEX IF NOT EXISTS idx_batch_assignments_batch ON batch_assignments(batch_id, position);
CREATE INDEX IF NOT EXISTS idx_batch_assignments_question ON batch_assignments(question_id);

-- Note: We'll populate batch_assignments via the import script for proper ordering
-- This allows each question to belong to multiple batches while maintaining order

COMMENT ON COLUMN batch_assignments.position IS 'The position of this question within the batch (1-6 for braided order)';
COMMENT ON TABLE batch_assignments IS 'Junction table mapping questions to batches with specific ordering';
