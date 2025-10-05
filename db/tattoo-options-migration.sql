-- Migration: Add tattoo option tables (color, size, placement)
-- Date: October 5, 2025

-- Color options table
CREATE TABLE IF NOT EXISTS color_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hex_code VARCHAR(7), -- For color preview (e.g., #FF0000)
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Size options table
CREATE TABLE IF NOT EXISTS size_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    size_range VARCHAR(50), -- e.g., "Small (2-4 inches)", "Large (8-12 inches)"
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placement options table
CREATE TABLE IF NOT EXISTS placement_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    body_area VARCHAR(100), -- e.g., "Arm", "Leg", "Back"
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for color options
INSERT INTO color_options (name, description, hex_code, display_order) VALUES
('Black & Gray', 'Classic black and gray tattoo style', '#000000', 1),
('Color', 'Full color tattoo with vibrant hues', '#FF6B6B', 2),
('Blackwork', 'Solid black ink only', '#000000', 3),
('Watercolor', 'Soft, blended color effect', '#87CEEB', 4),
('Minimal Color', 'Subtle color accents', '#DDA0DD', 5)
ON CONFLICT DO NOTHING;

-- Insert sample data for size options
INSERT INTO size_options (name, description, size_range, display_order) VALUES
('Small', 'Delicate, discreet tattoo', '1-3 inches', 1),
('Medium', 'Noticeable but not overwhelming', '3-6 inches', 2),
('Large', 'Bold, statement piece', '6-12 inches', 3),
('Extra Large', 'Full coverage or sleeve section', '12+ inches', 4)
ON CONFLICT DO NOTHING;

-- Insert sample data for placement options
INSERT INTO placement_options (name, description, body_area, display_order) VALUES
('Upper Arm', 'Bicep area', 'Arm', 1),
('Forearm', 'Inner or outer forearm', 'Arm', 2),
('Wrist', 'Around the wrist', 'Arm', 3),
('Ankle', 'Around the ankle', 'Leg', 4),
('Calf', 'Back of lower leg', 'Leg', 5),
('Thigh', 'Upper leg area', 'Leg', 6),
('Upper Back', 'Shoulder blade area', 'Back', 7),
('Lower Back', 'Lumbar region', 'Back', 8),
('Chest', 'Pectoral area', 'Torso', 9),
('Ribs', 'Side torso', 'Torso', 10),
('Neck', 'Back or side of neck', 'Neck', 11),
('Foot', 'Top or side of foot', 'Leg', 12)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_color_options_active ON color_options(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_size_options_active ON size_options(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_placement_options_active ON placement_options(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_placement_options_body_area ON placement_options(body_area);