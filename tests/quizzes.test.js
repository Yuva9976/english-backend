// tests/quizzes.test.js
const request = require('supertest');
const app = require('../app');
const models = require('../models');
const { sequelize, Lesson, Quiz, Question, Answer } = models;

beforeAll(async () => {
  // Force sync for test environment
  await sequelize.sync({ force: true });

  // create a lesson to attach quizzes to
  await Lesson.create({ title: 'Sample Lesson for Quiz', description: 'Test lesson' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Quiz Flow', () => {
  let quizId;
  test('Create quiz with questions and answers', async () => {
    const lessons = await Lesson.findAll();
    const lessonId = lessons[0].id;

    const payload = {
      lessonId,
      title: 'Sample Quiz',
      description: 'A short quiz',
      questions: [
        {
          text: 'What is 2+2?',
          type: 'single',
          points: 1,
          answers: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '22', isCorrect: false }
          ]
        },
        {
          text: 'Select vowels',
          type: 'multiple',
          points: 2,
          answers: [
            { text: 'a', isCorrect: true },
            { text: 'b', isCorrect: false },
            { text: 'e', isCorrect: true },
            { text: 'c', isCorrect: false }
          ]
        }
      ]
    };

    const res = await request(app).post('/api/quizzes').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Sample Quiz');
    expect(res.body.questions.length).toBe(2);
    quizId = res.body.id;
  });

  test('Fetch quiz as learner (no isCorrect flags)', async () => {
    const res = await request(app).get(`/api/quizzes/${quizId}?for=learner`);
    expect(res.statusCode).toBe(200);
    const q = res.body;
    expect(q.title).toBe('Sample Quiz');
    expect(q.questions[0].answers[0]).not.toHaveProperty('isCorrect');
  });

  test('Submit quiz and get score', async () => {
    // fetch teacher view to get correct answer ids
    const teacherView = await request(app).get(`/api/quizzes/${quizId}`);
    const q1 = teacherView.body.questions[0];
    const q2 = teacherView.body.questions[1];

    // Find correct ids
    const q1Correct = q1.answers.find(a => a.isCorrect).id;
    const q2Corrects = q2.answers.filter(a => a.isCorrect).map(a => a.id);

    const payload = {
      answers: [
        { questionId: q1.id, answerIds: [q1Correct] },             // correct
        { questionId: q2.id, answerIds: q2Corrects }               // correct
      ]
    };

    const res = await request(app).post(`/api/quizzes/${quizId}/submit`).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.scorePercent).toBeGreaterThanOrEqual(100); // both correct => 100
    expect(res.body.earnedPoints).toBeGreaterThanOrEqual(3); // 1 + 2 points
  });
});
