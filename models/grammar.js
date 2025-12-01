const { DataTypes, Sequelize } = require('sequelize');

// Create Sequelize connection using same credentials as main app
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'english_portal',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

const PartOfSpeech = sequelize.define('PartOfSpeech', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  definition: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  importance: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(5)
  }
}, {
  tableName: 'parts_of_speech',
  timestamps: true,
  underscored: true
});

const GrammarType = sequelize.define('GrammarType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(5)
  },
  examples: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  sample_words: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  color: {
    type: DataTypes.STRING(20)
  },
  learn_more_content: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'grammar_types',
  timestamps: true,
  underscored: true
});

const GrammarRule = sequelize.define('GrammarRule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rule_type: {
    type: DataTypes.ENUM('do', 'dont'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200)
  },
  points: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  color: {
    type: DataTypes.STRING(20)
  },
  icon: {
    type: DataTypes.STRING(5)
  }
}, {
  tableName: 'grammar_rules',
  timestamps: true,
  underscored: true
});

const GrammarExample = sequelize.define('GrammarExample', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sentence: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  usage_pattern: {
    type: DataTypes.STRING(100)
  },
  category: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'grammar_examples',
  timestamps: true,
  underscored: true
});

const GrammarExercise = sequelize.define('GrammarExercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exercise_type: {
    type: DataTypes.ENUM('writing', 'reading'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100)
  },
  prompt: {
    type: DataTypes.TEXT
  },
  passage: {
    type: DataTypes.TEXT
  },
  sample_answer: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'grammar_exercises',
  timestamps: true,
  underscored: true
});

const GrammarQuizQuestion = sequelize.define('GrammarQuizQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  emoji: {
    type: DataTypes.STRING(5)
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  question_type: {
    type: DataTypes.ENUM('multiple-choice', 'fill-blank', 'matching'),
    allowNull: false
  },
  hint: {
    type: DataTypes.TEXT
  },
  options: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  correct_answer: {
    type: DataTypes.STRING(500)
  },
  explanation: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'grammar_quiz_questions',
  timestamps: true,
  underscored: true
});

const GrammarResource = sequelize.define('GrammarResource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  resource_type: {
    type: DataTypes.ENUM('video', 'article', 'link'),
    allowNull: false
  },
  video_embed_id: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'grammar_resources',
  timestamps: true,
  underscored: true
});

// Define associations
PartOfSpeech.hasMany(GrammarType, { foreignKey: 'part_id', as: 'types' });
PartOfSpeech.hasMany(GrammarRule, { foreignKey: 'part_id', as: 'rules' });
PartOfSpeech.hasMany(GrammarExample, { foreignKey: 'part_id', as: 'examples' });
PartOfSpeech.hasMany(GrammarExercise, { foreignKey: 'part_id', as: 'exercises' });
PartOfSpeech.hasMany(GrammarQuizQuestion, { foreignKey: 'part_id', as: 'quiz' });
PartOfSpeech.hasMany(GrammarResource, { foreignKey: 'part_id', as: 'resources' });

module.exports = {
  sequelize,
  PartOfSpeech,
  GrammarType,
  GrammarRule,
  GrammarExample,
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarResource
};
