// models/index.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'english_portal',
  DB_USER = 'postgres',
  DB_PASS = '',
  USE_SQLITE = 'false',
  SQLITE_FILE = 'dev.sqlite'
} = process.env;

let sequelize;
if (USE_SQLITE === '1' || USE_SQLITE === 'true') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: SQLITE_FILE,
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  // Create Sequelize connection for Postgres
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
}

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

// --- ATTENDANCE TABLE ---
const Attendance = sequelize.define('Attendance', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('present', 'absent', 'late', 'excused'), allowNull: false, defaultValue: 'present' },
  lesson_id: { type: DataTypes.STRING, allowNull: true },
  session_id: { type: DataTypes.STRING, allowNull: true },
  note: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'attendance',
  underscored: true,
  timestamps: true,
});

/* -------------------------------------------------------------------------- */
/*                             QUIZ MODULE (EXISTING)                         */
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
/*                         QUIZ ATTEMPTS (NEW FOR DAY 7)                      */
/* -------------------------------------------------------------------------- */

const QuizAttempt = sequelize.define('QuizAttempt', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  quiz_id: { type: DataTypes.INTEGER, allowNull: false },
  total_points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  earned_points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  score_percent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  details: { type: DataTypes.JSONB, allowNull: true },
  submitted_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'quiz_attempts',
  underscored: true,
  timestamps: false,
});

/* -------------------------------------------------------------------------- */
/*                              CLASSROOM MODELS                              */
/* -------------------------------------------------------------------------- */

// --- CLASSROOM / COURSES ---
const Classroom = sequelize.define('Classroom', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  teacher_id: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'classes',
  underscored: true,
  timestamps: true,
});

// --- CLASS SESSIONS ---
const ClassSession = sequelize.define('ClassSession', {
  class_id: { type: DataTypes.INTEGER, allowNull: false },
  session_token: { type: DataTypes.STRING, allowNull: false },
  started_at: { type: DataTypes.DATE, allowNull: true },
  ended_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'class_sessions',
  underscored: true,
  timestamps: true,
});

// --- CLASS PARTICIPANTS ---
const ClassParticipant = sequelize.define('ClassParticipant', {
  class_id: { type: DataTypes.INTEGER, allowNull: false },
  session_token: { type: DataTypes.STRING, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.ENUM('host','participant'), defaultValue: 'participant' },
  joined_at: { type: DataTypes.DATE, allowNull: true },
  left_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'class_participants',
  underscored: true,
  timestamps: true,
});

// --- CHAT MESSAGES ---
const ChatMessage = sequelize.define('ChatMessage', {
  class_id: { type: DataTypes.INTEGER, allowNull: false },
  session_token: { type: DataTypes.STRING, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  user_name: { type: DataTypes.STRING, allowNull: true },
  text: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'chat_messages',
  underscored: true,
  timestamps: true,
});

// --- CLASS RESOURCES ---
const ClassResource = sequelize.define('ClassResource', {
  class_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: true },
  url: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  created_by: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'class_resources',
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

// Users & Attendance
User.hasMany(Attendance, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });

// Lessons & Progress
Lesson.hasMany(Progress, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
Progress.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// Sections & Progress
LessonSection.hasMany(Progress, { foreignKey: 'section_id', onDelete: 'CASCADE' });
Progress.belongsTo(LessonSection, { foreignKey: 'section_id' });

// Quiz relations
Lesson.hasMany(Quiz, { foreignKey: 'lesson_id', as: 'quizzes', onDelete: 'CASCADE' });
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// QuizAttempt relations
User.hasMany(QuizAttempt, { foreignKey: 'user_id', as: 'quizAttempts', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Quiz.hasMany(QuizAttempt, { foreignKey: 'quiz_id', as: 'attempts', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

/* -------------------------------------------------------------------------- */
/*                               CLASSROOM RELATIONS                          */
/* -------------------------------------------------------------------------- */

Classroom.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
Classroom.hasMany(ClassSession, { foreignKey: 'class_id' });
ClassSession.belongsTo(Classroom, { foreignKey: 'class_id' });

Classroom.hasMany(ClassParticipant, { foreignKey: 'class_id' });
ClassParticipant.belongsTo(Classroom, { foreignKey: 'class_id' });
ClassParticipant.belongsTo(User, { foreignKey: 'user_id' });

Classroom.hasMany(ChatMessage, { foreignKey: 'class_id' });
ChatMessage.belongsTo(Classroom, { foreignKey: 'class_id' });
ChatMessage.belongsTo(User, { foreignKey: 'user_id' });

Classroom.hasMany(ClassResource, { foreignKey: 'class_id' });
ClassResource.belongsTo(Classroom, { foreignKey: 'class_id' });


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
  Attendance,
  Quiz,
  Question,
  Answer,
  QuizAttempt, // ✅ newly added export
  // Classroom models
  Classroom,
  ClassSession,
  ClassParticipant,
  ChatMessage,
  ClassResource,
};
