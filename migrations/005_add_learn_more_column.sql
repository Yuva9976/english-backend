-- Add learn_more_content column to grammar_types table (PostgreSQL)
ALTER TABLE grammar_types 
ADD COLUMN IF NOT EXISTS learn_more_content JSONB;

-- Optional: Add comment
COMMENT ON COLUMN grammar_types.learn_more_content IS 'Stores detailed Learn More content with examples, practice questions, rules, etc.';
