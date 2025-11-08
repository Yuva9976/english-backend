// models/index.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'english_portal',
  DB_USER = 'postgres',
  DB_PASS = '',
} = process.env;

// Create Sequelize connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

/* -------------------------------------------------------------------------- */
/*                              MODEL DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

// --- USERS TABLE ---
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('learner', 'teacher', 'admin'), defaultValue: 'learner' },
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

// --- LESSONS TABLE ---
const Lesson = sequelize.define('Lesson', {
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true },
  description: { type: DataTypes.TEXT },
  level: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  media_url: { type: DataTypes.STRING },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'lessons',
  underscored: true,
  timestamps: true,
});

// --- LESSON SECTIONS TABLE ---
const LessonSection = sequelize.define('LessonSection', {
  lesson_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  media_url: { type: DataTypes.STRING },
}, {
  tableName: 'lesson_sections',
  underscored: true,
  timestamps: true,
});

// --- PROGRESS TABLE ---
const Progress = sequelize.define('Progress', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  lesson_id: { type: DataTypes.INTEGER, allowNull: true },
  section_id: { type: DataTypes.INTEGER, allowNull: true },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'progress',
  underscored: true,
  timestamps: true,
});

/* -------------------------------------------------------------------------- */
/*                             QUIZ MODULE (NEW)                              */
/* -------------------------------------------------------------------------- */

// --- QUIZ TABLE ---
const Quiz = sequelize.define('Quiz', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  timeLimitMinutes: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'quizzes',
  underscored: true,
  timestamps: true,
});

// --- QUESTION TABLE ---
const Question = sequelize.define('Question', {
  text: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM('single', 'multiple'), allowNull: false, defaultValue: 'single' },
  points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, {
  tableName: 'questions',
  underscored: true,
  timestamps: true,
});

// --- ANSWER TABLE ---
const Answer = sequelize.define('Answer', {
  text: { type: DataTypes.TEXT, allowNull: false },
  isCorrect: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  tableName: 'answers',
  underscored: true,
  timestamps: true,
});

/* -------------------------------------------------------------------------- */
/*                                 RELATIONS                                  */
/* -------------------------------------------------------------------------- */

// Users & Lessons
User.hasMany(Lesson, { foreignKey: 'created_by' });
Lesson.belongsTo(User, { foreignKey: 'created_by' });

// Lessons & Sections
Lesson.hasMany(LessonSection, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
LessonSection.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// Users & Progress
User.hasMany(Progress, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Progress.belongsTo(User, { foreignKey: 'user_id' });

// Lessons & Progress
Lesson.hasMany(Progress, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// Sections & Progress
LessonSection.hasMany(Progress, { foreignKey: 'section_id', onDelete: 'CASCADE' });
Progress.belongsTo(LessonSection, { foreignKey: 'section_id' });

// 🔹 NEW — QUIZ RELATIONS
Lesson.hasMany(Quiz, { foreignKey: 'lesson_id', as: 'quizzes', onDelete: 'CASCADE' });
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

/* -------------------------------------------------------------------------- */
/*                               TEST CONNECTION                              */
/* -------------------------------------------------------------------------- */

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅  Sequelize: Connection has been established successfully.');
  } catch (error) {
    console.error('❌  Sequelize: Unable to connect to the database:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  testConnection,
  User,
  Lesson,
  LessonSection,
  Progress,
  Quiz,
  Question,
  Answer,
};
