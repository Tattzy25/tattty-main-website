-- Pipeline Configuration Table
CREATE TABLE IF NOT EXISTS pipeline_config (
  id SERIAL PRIMARY KEY,
  box1_data TEXT,
  box2_data TEXT,
  box3_data TEXT,
  box4_data TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pipeline_config_updated ON pipeline_config(updated_at DESC);
