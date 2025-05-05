-- Create tables for chat history
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for inspiration categories
CREATE TABLE IF NOT EXISTS public.inspiration_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for inspiration images
CREATE TABLE IF NOT EXISTS public.inspiration_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id INTEGER REFERENCES inspiration_categories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for AR previews
CREATE TABLE IF NOT EXISTS public.ar_previews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  design_id UUID REFERENCES tattoo_designs(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add is_favorite column to tattoo_designs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tattoo_designs' 
    AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE public.tattoo_designs ADD COLUMN is_favorite BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_images_category_id ON public.inspiration_images(category_id);
CREATE INDEX IF NOT EXISTS idx_ar_previews_user_id ON public.ar_previews(user_id);
CREATE INDEX IF NOT EXISTS idx_ar_previews_design_id ON public.ar_previews(design_id);

-- Enable RLS on new tables
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ar_previews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY chat_history_user_policy ON public.chat_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY inspiration_categories_read_policy ON public.inspiration_categories
  FOR SELECT USING (true);

CREATE POLICY inspiration_images_read_policy ON public.inspiration_images
  FOR SELECT USING (true);

CREATE POLICY ar_previews_user_policy ON public.ar_previews
  FOR ALL USING (auth.uid() = user_id);
