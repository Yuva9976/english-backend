// routes/progress.js
const express = require('express');
const router = express.Router();
const { Progress, Lesson, LessonSection } = require('../models');
const { authRequired } = require('../middleware/auth');

// Mark section as complete
router.post('/progress/section/:sectionId', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const sectionId = parseInt(req.params.sectionId, 10);

    const section = await LessonSection.findByPk(sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    let progress = await Progress.findOne({ where: { user_id: userId, section_id: sectionId } });
    if (!progress) {
      progress = await Progress.create({ user_id: userId, section_id: sectionId, completed: true });
    } else {
      progress.completed = true;
      await progress.save();
    }

    res.json({ ok: true, progress });
  } catch (err) {
    console.error('section progress error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark lesson as complete
router.post('/progress/lesson/:lessonId', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const lessonId = parseInt(req.params.lessonId, 10);

    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    let progress = await Progress.findOne({ where: { user_id: userId, lesson_id: lessonId } });
    if (!progress) {
      progress = await Progress.create({ user_id: userId, lesson_id: lessonId, completed: true });
    } else {
      progress.completed = true;
      await progress.save();
    }

    res.json({ ok: true, progress });
  } catch (err) {
    console.error('lesson progress error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user progress summary
router.get('/progress/user/:userId', authRequired, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (req.user.id !== userId && req.user.role === 'learner') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const records = await Progress.findAll({ where: { user_id: userId } });
    res.json(records);
  } catch (err) {
    console.error('get progress error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
