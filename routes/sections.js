// routes/sections.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // allow :lessonId from parent routes
const { Lesson, LessonSection } = require('../models');
const { authRequired, requireRole } = require('../middleware/auth');

// List sections for a lesson (public)
router.get('/lessons/:lessonId/sections', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    const sections = await LessonSection.findAll({
      where: { lesson_id: lessonId },
      order: [['order_index', 'ASC']],
      attributes: ['id','lesson_id','title','content','order_index','media_url','createdAt'],
    });
    res.json(sections);
  } catch (err) {
    console.error('list sections error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single section
router.get('/sections/:id', async (req, res) => {
  try {
    const section = await LessonSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ error: 'Section not found' });
    res.json(section);
  } catch (err) {
    console.error('get section error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a section (teacher/admin only)
router.post('/lessons/:lessonId/sections', authRequired, requireRole('teacher','admin'), async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    const { title, content, media_url, order_index } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    // ensure lesson exists
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const section = await LessonSection.create({
      lesson_id: lessonId,
      title,
      content: content || null,
      media_url: media_url || null,
      order_index: (typeof order_index === 'number') ? order_index : 0,
    });

    res.status(201).json(section);
  } catch (err) {
    console.error('create section error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a section (teacher/admin only)
router.put('/sections/:id', authRequired, requireRole('teacher','admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const body = req.body || {};
    const section = await LessonSection.findByPk(id);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const fields = {};
    if (body.title !== undefined) fields.title = body.title;
    if (body.content !== undefined) fields.content = body.content;
    if (body.media_url !== undefined) fields.media_url = body.media_url;
    if (body.order_index !== undefined) fields.order_index = body.order_index;

    await section.update(fields);
    res.json(section);
  } catch (err) {
    console.error('update section error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a section (teacher/admin only)
router.delete('/sections/:id', authRequired, requireRole('teacher','admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const section = await LessonSection.findByPk(id);
    if (!section) return res.status(404).json({ error: 'Section not found' });
    await section.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error('delete section error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
