// routes/quizzes.js
const express = require('express');
const router = express.Router();

// models index should export Quiz, Question, Answer, Lesson, QuizAttempt, sequelize
const models = require('../models');
const { Quiz, Question, Answer, Lesson, QuizAttempt, sequelize } = models;

/*
  Create quiz (POST /api/quizzes)
  payload:
  {
    lessonId,
    title,
    description,
    timeLimitMinutes,
    questions: [
      { text, type: 'single'|'multiple', points, answers: [{ text, isCorrect }] }
    ]
  }
*/

// Optional auth middlewares (load if present)
let authMiddlewares = {};
try {
  authMiddlewares = require('../middleware/auth') || {};
} catch (e) {
  authMiddlewares = {};
}
const { authRequired, requireRole } = authMiddlewares;

// protect quiz creation to teachers/admins when auth is available
const createQuizMiddleware = [];
if (authRequired && requireRole) createQuizMiddleware.push(authRequired, requireRole('teacher', 'admin'));

router.post('/', ...createQuizMiddleware, async (req, res) => {
  const payload = req.body;
  const t = await sequelize.transaction();
  try {
    const lesson = await Lesson.findByPk(payload.lessonId, { transaction: t });
    if (!lesson) {
      await t.rollback();
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Only allow creating a quiz for a lesson the teacher owns (unless admin)
    if (req.user && req.user.role !== 'admin' && lesson.created_by !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: 'Forbidden' });
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
    console.error('Create quiz error:', err);
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
    console.error('Get quizzes error:', err);
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
    if (forRole === 'learner' && Array.isArray(result.questions)) {
      result.questions = result.questions.map(q => {
        q.answers = q.answers.map(a => {
          // remove isCorrect before sending to learner
          if (a.hasOwnProperty('isCorrect')) delete a.isCorrect;
          return a;
        });
        return q;
      });
    }
    return res.json(result);
  } catch (err) {
    console.error('Get quiz error:', err);
    return res.status(500).json({ message: err.message });
  }
});

/*
  Submit quiz answers and get score
  POST /api/quizzes/:id/submit
  payload:
  {
    userId (optional if you use auth and have req.user),
    answers: [
      { questionId: 1, answerIds: [3] },
      { questionId: 2, answerIds: [5,6] }
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
    // Accept userId from body (or from req.user if you have auth middleware)
    const userId = req.body.userId || (req.user && req.user.id) || null;

    const questionsMap = new Map();
    for (const q of quiz.questions) questionsMap.set(q.id, q);

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
        correct = (selected.length === 1 && correctAnswerIds.length === 1 && selected[0] === correctAnswerIds[0]);
      } else {
        if (selected.length === correctAnswerIds.length) {
          correct = selected.every((v, i) => v === correctAnswerIds[i]);
        } else correct = false;
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

    const scorePercent = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

    // Persist QuizAttempt if userId present
    if (userId) {
      try {
        await QuizAttempt.create({
          user_id: userId,
          quiz_id: quiz.id,
          total_points: totalPoints,
          earned_points: earnedPoints,
          score_percent: scorePercent,
          details,
          submitted_at: new Date(),
        });
      } catch (persistErr) {
        console.error('Failed to persist quiz attempt:', persistErr);
        // do not fail the whole response — just log
      }
    }

    return res.json({
      quizId: quiz.id,
      totalPoints,
      earnedPoints,
      scorePercent,
      details
    });

  } catch (err) {
    console.error('Submit quiz error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Update quiz metadata (teacher)
/*
  PUT /api/quizzes/:id
  body: { title, description, timeLimitMinutes }
*/
const updateQuizMiddleware = [];
if (authRequired && requireRole) updateQuizMiddleware.push(authRequired, requireRole('teacher', 'admin'));

router.put('/:id', ...updateQuizMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // verify ownership: lesson.created_by === req.user.id OR admin
    const lesson = await Lesson.findByPk(quiz.lesson_id);
    if (req.user && req.user.role !== 'admin' && lesson && lesson.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, timeLimitMinutes } = req.body;
    await quiz.update({ title, description, timeLimitMinutes });
    return res.json(quiz);
  } catch (err) {
    console.error('Update quiz error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Delete quiz (teacher)
const deleteQuizMiddleware = [];
if (authRequired && requireRole) deleteQuizMiddleware.push(authRequired, requireRole('teacher', 'admin'));

router.delete('/:id', ...deleteQuizMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const lesson = await Lesson.findByPk(quiz.lesson_id);
    if (req.user && req.user.role !== 'admin' && lesson && lesson.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await quiz.destroy();
    return res.json({ message: 'Quiz deleted' });
  } catch (err) {
    console.error('Delete quiz error:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
