// routes/quizzes.js
const express = require('express');
const router = express.Router();

// Adjust this import path to your models index file
const models = require('../models'); // should export sequelize and models
const { Quiz, Question, Answer, Lesson, sequelize } = models;

/*
  Data shape for creating a quiz (POST /api/quizzes):
  {
    lessonId,
    title,
    description,
    timeLimitMinutes,
    questions: [
      {
        text,
        type: 'single' | 'multiple',
        points,
        answers: [
          { text, isCorrect }
        ]
      }
    ]
  }
*/

// Optional auth middlewares (uncomment if present in your project)
// const { requireAuth, requireTeacher } = require('../middleware/auth');

router.post('/', /* requireAuth, requireTeacher, */ async (req, res) => {
  const payload = req.body;
  const t = await sequelize.transaction();
  try {
    const lesson = await Lesson.findByPk(payload.lessonId, { transaction: t });
    if (!lesson) {
      await t.rollback();
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const quiz = await Quiz.create({
      title: payload.title,
      description: payload.description || null,
      timeLimitMinutes: payload.timeLimitMinutes || null,
      lesson_id: payload.lessonId,
    }, { transaction: t });

    if (Array.isArray(payload.questions)) {
      for (const q of payload.questions) {
        const question = await Question.create({
          text: q.text,
          type: q.type || 'single',
          points: q.points || 1,
          quiz_id: quiz.id,
        }, { transaction: t });

        if (Array.isArray(q.answers)) {
          for (const a of q.answers) {
            await Answer.create({
              text: a.text,
              isCorrect: !!a.isCorrect,
              question_id: question.id,
            }, { transaction: t });
          }
        }
      }
    }

    await t.commit();
    const created = await Quiz.findByPk(quiz.id, {
      include: {
        model: Question,
        as: 'questions',
        include: { model: Answer, as: 'answers' }
      }
    });
    return res.status(201).json(created);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: 'Failed to create quiz', error: err.message });
  }
});

// Get quizzes for a lesson
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { lesson_id: req.params.lessonId },
    });
    return res.json(quizzes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get a quiz (use ?for=learner to hide isCorrect flags)
router.get('/:id', async (req, res) => {
  try {
    const forRole = req.query.for || 'teacher'; // 'learner' hides isCorrect
    const quiz = await Quiz.findByPk(req.params.id, {
      include: {
        model: Question,
        as: 'questions',
        include: { model: Answer, as: 'answers' }
      }
    });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const result = quiz.toJSON();
    if (forRole === 'learner') {
      // hide isCorrect for learners
      result.questions = result.questions.map(q => {
        q.answers = q.answers.map(a => {
          delete a.isCorrect;
          return a;
        });
        return q;
      });
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Submit quiz answers and get score
// POST /api/quizzes/:id/submit
/*
  payload:
  {
    answers: [
      { questionId: 1, answerIds: [3] },   // single: array length 1
      { questionId: 2, answerIds: [5,6] }  // multiple: array of selected answer ids
    ]
  }
*/
router.post('/:id/submit', /* requireAuth, */ async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: {
        model: Question,
        as: 'questions',
        include: { model: Answer, as: 'answers' }
      }
    });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const submitted = req.body.answers || [];
    const questionsMap = new Map();
    for (const q of quiz.questions) {
      questionsMap.set(q.id, q);
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    const details = [];

    for (const q of quiz.questions) {
      totalPoints += (q.points || 1);
    }

    for (const sub of submitted) {
      const q = questionsMap.get(sub.questionId);
      if (!q) {
        details.push({ questionId: sub.questionId, correct: false, reason: 'Question not found in quiz' });
        continue;
      }
      const correctAnswerIds = q.answers.filter(a => a.isCorrect).map(a => a.id).sort((a,b)=>a-b);
      const selected = Array.isArray(sub.answerIds) ? sub.answerIds.map(Number).sort((a,b)=>a-b) : [];

      let correct = false;
      if (q.type === 'single') {
        // correct if exactly one selected and matches a correct answer
        correct = (selected.length === 1 && correctAnswerIds.length === 1 && selected[0] === correctAnswerIds[0]);
      } else {
        // multiple: treat correct if sets equal
        if (selected.length === correctAnswerIds.length) {
          correct = selected.every((v, i) => v === correctAnswerIds[i]);
        } else {
          correct = false;
        }
      }

      if (correct) earnedPoints += (q.points || 1);

      details.push({
        questionId: q.id,
        selected,
        correctAnswerIds,
        correct,
        points: q.points || 1
      });
    }

    // For questions not submitted, they are incorrect (0 points)
    // Score as percentage
    const scorePercent = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

    return res.json({
      quizId: quiz.id,
      totalPoints,
      earnedPoints,
      scorePercent,
      details
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

// Update quiz (teacher)
router.put('/:id', /* requireAuth, requireTeacher, */ async (req, res) => {
  // Minimal: allow updating title/description/timeLimit only.
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const { title, description, timeLimitMinutes } = req.body;
    await quiz.update({ title, description, timeLimitMinutes });
    return res.json(quiz);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete quiz (teacher)
router.delete('/:id', /* requireAuth, requireTeacher, */ async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.destroy();
    return res.json({ message: 'Quiz deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
