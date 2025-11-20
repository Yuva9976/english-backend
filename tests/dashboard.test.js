// tests/dashboard.test.js
const request = require('supertest');
const app = require('../app');
const models = require('../models');
const { sequelize, User, Lesson, LessonSection, Progress, Quiz, Question, Answer, QuizAttempt } = models;

beforeAll(async () => {
  // reset DB
  await sequelize.sync({ force: true });

  // create a teacher and a learner
  const teacher = await User.create({ name: 'Teacher One', email: 't1@example.com', password_hash: 'x', role: 'teacher' });
  const learner = await User.create({ name: 'Learner One', email: 'l1@example.com', password_hash: 'x', role: 'learner' });

  // create a lesson by teacher
  const lesson = await Lesson.create({ title: 'Lesson 1', description: 'desc', created_by: teacher.id });

  // create two sections for the lesson
  const s1 = await LessonSection.create({ lesson_id: lesson.id, title: 'Sec 1', content: 'c1' });
  const s2 = await LessonSection.create({ lesson_id: lesson.id, title: 'Sec 2', content: 'c2' });

  // Mark learner completed only one section
  await Progress.create({ user_id: learner.id, lesson_id: lesson.id, section_id: s1.id, completed: true });
  await Progress.create({ user_id: learner.id, lesson_id: lesson.id, section_id: s2.id, completed: false });

  // create a quiz for this lesson (directly via models)
  const quiz = await Quiz.create({ title: 'Q1', description: 'quiz', lesson_id: lesson.id });
  const q = await Question.create({ text: '2+2?', type: 'single', points: 1, quiz_id: quiz.id });
  const a1 = await Answer.create({ text: '3', isCorrect: false, question_id: q.id });
  const a2 = await Answer.create({ text: '4', isCorrect: true, question_id: q.id });

  // create a quiz attempt for learner (simulate earlier attempt)
  await QuizAttempt.create({
    user_id: learner.id,
    quiz_id: quiz.id,
    total_points: 1,
    earned_points: 1,
    score_percent: 100,
    details: [{ questionId: q.id, selected: [a2.id], correct: true }],
    submitted_at: new Date(),
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Dashboard endpoints', () => {
  test('GET /api/dashboard/learner/:userId returns correct shape', async () => {
    const res = await request(app).get('/api/dashboard/learner/2');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('userId', 2);
    expect(res.body).toHaveProperty('lessonsTotal');
    expect(res.body).toHaveProperty('lessonsCompletedCount');
    expect(Array.isArray(res.body.lessonsProgress)).toBe(true);
    expect(Array.isArray(res.body.quizAttempts)).toBe(true);
    // ensure at least one quiz attempt present
    expect(res.body.quizAttempts.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/dashboard/teacher/:teacherId returns per-lesson stats', async () => {
    const res = await request(app).get('/api/dashboard/teacher/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('teacherId', 1);
    expect(Array.isArray(res.body.lessons)).toBe(true);
    const lessonStats = res.body.lessons[0];
    expect(lessonStats).toHaveProperty('lessonId');
    expect(lessonStats).toHaveProperty('title');
    expect(lessonStats).toHaveProperty('studentsStarted');
    expect(lessonStats).toHaveProperty('avgCompletionPercent');
    // avgQuizScore can be null if no attempts or a number
    expect(lessonStats).toHaveProperty('avgQuizScore');
  });
});
