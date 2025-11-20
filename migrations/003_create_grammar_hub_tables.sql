-- Create Parts of Speech table
CREATE TABLE IF NOT EXISTS parts_of_speech (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  importance TEXT NOT NULL,
  icon VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Types/Categories table
CREATE TABLE IF NOT EXISTS grammar_types (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(5),
  examples JSONB DEFAULT '[]',
  sample_words JSONB DEFAULT '[]',
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Rules table
CREATE TABLE IF NOT EXISTS grammar_rules (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  rule_type VARCHAR(10) CHECK (rule_type IN ('do', 'dont')),
  title VARCHAR(50),
  points JSONB DEFAULT '[]',
  color VARCHAR(20),
  icon VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Examples table
CREATE TABLE IF NOT EXISTS grammar_examples (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  sentence TEXT NOT NULL,
  usage_pattern VARCHAR(100),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Exercises table
CREATE TABLE IF NOT EXISTS grammar_exercises (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  exercise_type VARCHAR(20) CHECK (exercise_type IN ('writing', 'reading')),
  title VARCHAR(100),
  prompt TEXT,
  passage TEXT,
  sample_answer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quiz Questions table
CREATE TABLE IF NOT EXISTS grammar_quiz_questions (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  emoji VARCHAR(5),
  question TEXT NOT NULL,
  question_type VARCHAR(30) CHECK (question_type IN ('multiple-choice', 'fill-blank', 'matching')),
  hint TEXT,
  options JSONB DEFAULT '[]',
  correct_answer INTEGER,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Resources table
CREATE TABLE IF NOT EXISTS grammar_resources (
  id SERIAL PRIMARY KEY,
  part_id INTEGER NOT NULL REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  resource_type VARCHAR(20) CHECK (resource_type IN ('video', 'article', 'link')),
  video_embed_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_grammar_types_part_id ON grammar_types(part_id);
CREATE INDEX idx_grammar_rules_part_id ON grammar_rules(part_id);
CREATE INDEX idx_grammar_examples_part_id ON grammar_examples(part_id);
CREATE INDEX idx_grammar_exercises_part_id ON grammar_exercises(part_id);
CREATE INDEX idx_grammar_quiz_part_id ON grammar_quiz_questions(part_id);
CREATE INDEX idx_grammar_resources_part_id ON grammar_resources(part_id);
