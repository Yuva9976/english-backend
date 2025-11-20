-- Migration: create tables for Module 2 (Learn English)
-- This is a scaffold SQL to be reviewed and applied with your migration tooling (psql / Sequelize / Umzug)

-- lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  level TEXT,
  description TEXT,
  created_by INTEGER,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- lesson_sections table
CREATE TABLE IF NOT EXISTS lesson_sections (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  sequence_order INTEGER DEFAULT 0,
  content_text TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  quiz_type TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional media table (can be replaced by S3 metadata)
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename TEXT,
  url TEXT,
  mime TEXT,
  size INTEGER,
  uploaded_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_skill_area ON lessons(skill_area);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
