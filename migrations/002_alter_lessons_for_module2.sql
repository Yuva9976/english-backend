-- Migration: Alter existing lessons table to support Module 2
-- Adds skill_area, level, slug, and published columns if they don't exist

-- Add columns safely (won't fail if they already exist)
DO $$ 
BEGIN
  -- Add slug column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='lessons' AND column_name='slug') THEN
    ALTER TABLE lessons ADD COLUMN slug TEXT;
  END IF;

  -- Add skill_area column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='lessons' AND column_name='skill_area') THEN
    ALTER TABLE lessons ADD COLUMN skill_area TEXT;
  END IF;

  -- Add level column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='lessons' AND column_name='level') THEN
    ALTER TABLE lessons ADD COLUMN level TEXT;
  END IF;

  -- Add published column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='lessons' AND column_name='published') THEN
    ALTER TABLE lessons ADD COLUMN published BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create lesson_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS lesson_sections (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  sequence_order INTEGER DEFAULT 0,
  content_text TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quizzes table if it doesn't exist (may already exist)
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  quiz_type TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create media table if it doesn't exist
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename TEXT,
  url TEXT,
  mime TEXT,
  size INTEGER,
  uploaded_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes (won't fail if they already exist)
CREATE INDEX IF NOT EXISTS idx_lessons_skill_area ON lessons(skill_area);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
