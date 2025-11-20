// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { sequelize, User, Lesson, LessonSection, Progress, Quiz, QuizAttempt } = require('../models');
const { Op } = require('sequelize');

/** Helper to parse and validate integer id params */
function parseId(val) {
  const id = Number(val);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

/*
  GET /api/dashboard/learner/:userId
*/
router.get('/learner/:userId', async (req, res) => {
  try {
    const userId = parseId(req.params.userId);
    if (!userId) return res.status(400).json({ message: 'Invalid userId parameter' });

    const lessonsTotal = await Lesson.count();

    const lessonsCompletedCount = await Progress.count({
      where: { user_id: userId, completed: true, lesson_id: { [Op.ne]: null } },
      distinct: true,
      col: 'lesson_id'
    });

    const lessons = await Lesson.findAll({
      limit: 50,
      order: [['createdAt', 'DESC']],
    });

    const lessonsProgress = await Promise.all(lessons.map(async (lesson) => {
      const totalSections = await LessonSection.count({ where: { lesson_id: lesson.id } });
      const completedSections = await Progress.count({
        where: { user_id: userId, lesson_id: lesson.id, section_id: { [Op.ne]: null }, completed: true }
      });
      const completed = totalSections > 0 ? (completedSections === totalSections) : false;
      return {
        lessonId: lesson.id,
        title: lesson.title,
        totalSections,
        completedSections,
        completed
      };
    }));

    const quizAttempts = await QuizAttempt.findAll({
      where: { user_id: userId },
      include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title', 'lesson_id'] }],
      order: [['submitted_at', 'DESC']],
      limit: 10
    });

    return res.json({
      userId,
      lessonsTotal,
      lessonsCompletedCount,
      lessonsProgress,
      quizAttempts
    });
  } catch (err) {
    console.error('Learner dashboard error:', err);
    return res.status(500).json({ message: err.message });
  }
});

/*
  GET /api/dashboard/teacher/:teacherId
*/
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const teacherId = parseId(req.params.teacherId);
    if (!teacherId) return res.status(400).json({ message: 'Invalid teacherId parameter' });

    const lessons = await Lesson.findAll({ where: { created_by: teacherId } });

    const results = await Promise.all(lessons.map(async (lesson) => {
      const studentsStarted = await Progress.count({
        where: { lesson_id: lesson.id },
        distinct: true,
        col: 'user_id'
      });

      const totalSections = await LessonSection.count({ where: { lesson_id: lesson.id } });

      let avgCompletionPercent = 0;
      if (totalSections > 0) {
        const users = await Progress.findAll({
          attributes: ['user_id'],
          where: { lesson_id: lesson.id },
          group: ['user_id'],
          raw: true
        });

        if (users.length === 0) {
          avgCompletionPercent = 0;
        } else {
          let sumPerc = 0;
          for (const u of users) {
            const completedSections = await Progress.count({
              where: { lesson_id: lesson.id, user_id: u.user_id, completed: true }
            });
            const perc = Math.round((completedSections / totalSections) * 100);
            sumPerc += perc;
          }
          avgCompletionPercent = Math.round(sumPerc / users.length);
        }
      }

      const quizzes = await Quiz.findAll({ where: { lesson_id: lesson.id } });
      let avgQuizScore = null;
      if (quizzes.length > 0) {
        const quizIds = quizzes.map(q => q.id);
        const attempts = await QuizAttempt.findAll({
          where: { quiz_id: { [Op.in]: quizIds } },
          attributes: ['score_percent']
        });
        if (attempts.length > 0) {
          const total = attempts.reduce((s, a) => s + (a.score_percent || 0), 0);
          avgQuizScore = Math.round(total / attempts.length);
        } else {
          avgQuizScore = null;
        }
      }

      return {
        lessonId: lesson.id,
        title: lesson.title,
        studentsStarted,
        avgCompletionPercent,
        avgQuizScore
      };
    }));

    return res.json({ teacherId, lessons: results });
  } catch (err) {
    console.error('Teacher dashboard error:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
