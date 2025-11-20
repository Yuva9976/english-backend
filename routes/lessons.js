// routes/lessons.js
const express = require('express');
const router = express.Router();
const { Lesson, LessonSection } = require('../models');
let authMiddlewares = {};
try {
  authMiddlewares = require('../middleware/auth') || {};
} catch (e) {
  // middleware may not exist in dev or may throw — swallow silently
  authMiddlewares = {};
}
const { authRequired, requireRole } = authMiddlewares;
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

/*
  POST /api/lessons - create (teacher/admin only)
  NOTE: During dev, if auth middleware is not present / req.user is missing,
  this route will accept `created_by` in the request body so you can test via Postman.
*/
const createMiddleware = [];
if (authRequired && requireRole) {
  createMiddleware.push(authRequired, requireRole('teacher', 'admin'));
}

router.post('/', ...createMiddleware, async (req, res) => {
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

    // ensure uniqueness (simple loop)
    let suffix = 0;
    while (true) {
      const existing = await Lesson.findOne({ where: { slug } });
      if (!existing) break;
      suffix += 1;
      slug = `${slugBase}-${suffix}`;
    }

    // determine created_by (use authenticated user if present, otherwise accept body.created_by)
    const createdBy = (req.user && req.user.id) ? req.user.id : (body.created_by || null);

    const lesson = await Lesson.create({
      title,
      description,
      level,
      media_url,
      created_by: createdBy,
      slug,
    });

    // set Location header (RESTful)
    res.status(201)
      .location(`/api/lessons/${lesson.id}`)
      .json(lesson);
  } catch (err) {
    console.error('create lesson error', err);
    // detect validation errors
    if (err && err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

/*
  PUT /api/lessons/:id - update lesson (teacher who created it OR admin)
*/
const updateMiddleware = [];
if (authRequired && requireRole) updateMiddleware.push(authRequired, requireRole('teacher', 'admin'));

router.put('/:id', ...updateMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // only admin or the teacher who created the lesson can update
    if (req.user.role !== 'admin' && lesson.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const body = getBody(req);
    const updates = {};
    if (body.title) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.level) updates.level = body.level;
    if (body.media_url !== undefined) updates.media_url = body.media_url;

    await lesson.update(updates);
    return res.json(lesson);
  } catch (err) {
    console.error('update lesson error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/*
  DELETE /api/lessons/:id - delete lesson (teacher who created it OR admin)
*/
const deleteMiddleware = [];
if (authRequired && requireRole) deleteMiddleware.push(authRequired, requireRole('teacher', 'admin'));

router.delete('/:id', ...deleteMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    if (req.user.role !== 'admin' && lesson.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await lesson.destroy();
    return res.json({ ok: true });
  } catch (err) {
    console.error('delete lesson error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

