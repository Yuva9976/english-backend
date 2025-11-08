// routes/lessons.js
const express = require('express');
const router = express.Router();
const { Lesson, LessonSection } = require('../models');
const { authRequired, requireRole } = require('../middleware/auth');
const { Op } = require('sequelize');

// Helper: safely get body
function getBody(req) {
  return (req && req.body) ? req.body : {};
}

// GET /api/lessons  - public list (with basic pagination)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const lessons = await Lesson.findAll({
      attributes: ['id', 'title', 'slug', 'description', 'level', 'media_url', 'createdAt'],
      order: [['id', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: lessons, page, limit });
  } catch (err) {
    console.error('lessons list error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/lessons/:id - public detailed lesson with sections (sections ordered)
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{
        model: LessonSection,
        attributes: ['id', 'title', 'content', 'order_index', 'media_url'],
        order: [['order_index', 'ASC']]
      }],
    });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    // If Sequelize didn't order sections (sometimes include.order is ignored), sort here:
    if (lesson.LessonSections && Array.isArray(lesson.LessonSections)) {
      lesson.LessonSections.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    }
    res.json(lesson);
  } catch (err) {
    console.error('lesson get error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/lessons - create (teacher/admin only)
router.post('/', authRequired, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const body = getBody(req);
    const title = (body.title || '').trim();
    const description = body.description || null;
    const level = body.level || 'beginner';
    const media_url = body.media_url || null;

    if (!title) return res.status(400).json({ error: 'title required' });

    // generate basic slug
    let slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 180) || `lesson-${Date.now()}`;
    let slug = slugBase;

    // ensure uniqueness (simple loop, not for extremely high concurrency)
    let suffix = 0;
    while (true) {
      const existing = await Lesson.findOne({ where: { slug } });
      if (!existing) break;
      suffix += 1;
      slug = `${slugBase}-${suffix}`;
    }

    const lesson = await Lesson.create({
      title,
      description,
      level,
      media_url,
      created_by: req.user.id,
      slug,
    });

    // set Location header (RESTful)
    res.status(201)
      .location(`/api/lessons/${lesson.id}`)
      .json(lesson);
  } catch (err) {
    console.error('create lesson error', err);
    // detect validation errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
