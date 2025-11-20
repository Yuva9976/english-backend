-- Create Parts of Speech table
CREATE TABLE IF NOT EXISTS parts_of_speech (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  importance TEXT,
  quick_fact TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Types/Categories table
CREATE TABLE IF NOT EXISTS grammar_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_id INT NOT NULL,
  type_name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Type Examples table
CREATE TABLE IF NOT EXISTS type_examples (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type_id INT NOT NULL,
  example_text TEXT NOT NULL,
  FOREIGN KEY (type_id) REFERENCES grammar_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Type Sample Words table
CREATE TABLE IF NOT EXISTS type_sample_words (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type_id INT NOT NULL,
  word VARCHAR(100) NOT NULL,
  FOREIGN KEY (type_id) REFERENCES grammar_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Rules table
CREATE TABLE IF NOT EXISTS grammar_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_id INT NOT NULL,
  rule_type ENUM('do', 'dont') NOT NULL,
  rule_text TEXT NOT NULL,
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Examples table
CREATE TABLE IF NOT EXISTS grammar_examples (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_id INT NOT NULL,
  sentence TEXT NOT NULL,
  usage_pattern VARCHAR(200),
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Exercises table
CREATE TABLE IF NOT EXISTS grammar_exercises (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_id INT NOT NULL,
  exercise_type ENUM('writing', 'reading') NOT NULL,
  title VARCHAR(200) NOT NULL,
  prompt TEXT NOT NULL,
  sample_answer TEXT,
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quiz Questions table
CREATE TABLE IF NOT EXISTS grammar_quiz_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('multiple-choice', 'fill-blank', 'matching') NOT NULL,
  emoji VARCHAR(50),
  hint TEXT,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quiz Options table
CREATE TABLE IF NOT EXISTS grammar_quiz_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  option_text VARCHAR(255) NOT NULL,
  option_order INT,
  FOREIGN KEY (question_id) REFERENCES grammar_quiz_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Resources table
CREATE TABLE IF NOT EXISTS grammar_resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  resource_type ENUM('video', 'link', 'exercise') NOT NULL,
  embed_id VARCHAR(100),
  FOREIGN KEY (part_id) REFERENCES parts_of_speech(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
