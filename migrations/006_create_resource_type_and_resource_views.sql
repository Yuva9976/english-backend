-- 006_create_resource_type_and_resource_views.sql
-- Create `resource_type` enum and `resource_views` table if they don't exist.
-- Safe to run multiple times.

-- Create enum type resource_type if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
    CREATE TYPE resource_type AS ENUM ('pdf','video','link','doc','slides');
  END IF;
END$$;

-- Alter class_resources.type to use resource_type if the column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_resources' AND column_name='type') THEN
    BEGIN
      ALTER TABLE class_resources ALTER COLUMN type TYPE resource_type USING type::resource_type;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Could not alter class_resources.type to resource_type: %', SQLERRM;
    END;
  END IF;
END$$;

-- Create resource_views table
CREATE TABLE IF NOT EXISTS resource_views (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER NOT NULL REFERENCES class_resources(id) ON DELETE CASCADE,
  user_id INTEGER,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_resource_views_resource_id ON resource_views(resource_id);
