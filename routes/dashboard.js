// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { sequelize, User, Lesson, LessonSection, Progress, Quiz, QuizAttempt, Attendance } = require('../models');
const { Op } = require('sequelize');
const { authRequired } = require('../middleware/auth');

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

/*
  GET /api/dashboard/learner  (authenticated)
  Returns consolidated dashboard for the logged-in learner (req.user)
*/
router.get('/learner', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    // Profile
    const profile = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      level: req.user.level || null,
      xp: req.user.xp || 0,
      avatar: req.user.avatar || null,
    };

    // Enrolled courses heuristic: lessons with progress rows
    const lessonRows = await Progress.findAll({ where: { user_id: userId }, attributes: [[sequelize.fn('DISTINCT', sequelize.col('lesson_id')), 'lesson_id']], raw: true });
    const lessonIds = lessonRows.map(r => r.lesson_id).filter(Boolean);

    const courses = [];
    if (lessonIds.length > 0) {
      const lessons = await Lesson.findAll({ where: { id: lessonIds }, attributes: ['id','title'] });
      for (const lesson of lessons) {
        const totalSections = await LessonSection.count({ where: { lesson_id: lesson.id } });
        const completedSections = await Progress.count({ where: { user_id: userId, lesson_id: lesson.id, completed: true } });
        const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
        courses.push({ id: lesson.id, title: lesson.title, progress, completedSections, totalSections });
      }
    }

    // Attendance
    const attTotals = await Attendance.findAll({ where: { user_id: userId }, attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']], group: ['status'], raw: true });
    let present = 0, absent = 0, late = 0, excused = 0, totalDays = 0;
    attTotals.forEach(r => { const c = parseInt(r.count,10)||0; totalDays += c; if (r.status==='present') present = c; if(r.status==='absent') absent=c; if(r.status==='late') late=c; if(r.status==='excused') excused=c; });
    const attendancePercent = totalDays>0? Math.round((present/totalDays)*100):0;

    // Tasks - placeholder: no tasks table in schema
    const tasks = { assigned: 0, submitted: 0, completion: 0 };

    // Quiz stats
    const totalAttempts = await QuizAttempt.count({ where: { user_id: userId } });
    const avgRow = await QuizAttempt.findAll({ where: { user_id: userId }, attributes: [[sequelize.fn('AVG', sequelize.col('score_percent')), 'avgScore']], raw: true });
    const averageScore = avgRow && avgRow[0] ? parseFloat(avgRow[0].avgScore || 0) : 0;

    // Upcoming lesson: first LessonSection not completed
    const upcoming = await LessonSection.findOne({ where: sequelize.literal(`id NOT IN (SELECT section_id FROM progress WHERE user_id = ${userId} AND completed = true)`), order: [['lesson_id','ASC'],['order_index','ASC']], attributes: ['id','lesson_id','title','order_index'], raw: true });

    // Weekly tests graph (last 7 days)
    const sevenAgo = new Date(); sevenAgo.setDate(sevenAgo.getDate()-6);
    const start = sevenAgo.toISOString().slice(0,10);
    const attempts = await QuizAttempt.findAll({ where: { user_id: userId, submitted_at: { [Op.gte]: new Date(start) } }, attributes: [[sequelize.fn('DATE', sequelize.col('submitted_at')), 'day'], [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('AVG', sequelize.col('score_percent')), 'avgScore']], group: [sequelize.literal('DATE(submitted_at)')], raw: true });
    const weekly = [];
    for (let i=0;i<7;i++){ const d=new Date(); d.setDate(new Date().getDate()-(6-i)); const key=d.toISOString().slice(0,10); const r=attempts.find(a=>a.day===key); weekly.push({day:key, count: r?parseInt(r.count,10):0, avgScore: r?parseFloat(r.avgScore||0):0}) }

    return res.json({ profile, courses, attendance: { totalDays, present, absent, late, excused, percent: attendancePercent }, tasks, quizzes: { totalAttempts, averageScore }, upcoming, weeklyTests: weekly });
  } catch (err) {
    console.error('learner dashboard error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

