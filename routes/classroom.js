const express = require('express');
const router = express.Router();
const { Classroom, ClassSession, ClassParticipant, ClassResource, ChatMessage, User } = require('../models');
const { authRequired } = require('../middleware/auth');

// Create a new session for a class (teacher only)
router.post('/session/create', authRequired, async (req, res) => {
  try {
    const { classId } = req.body;
    const cls = await Classroom.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    // Only teacher or admin can create
    if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.id !== cls.teacher_id) return res.status(403).json({ error: 'Unauthorized' });

    const token = `sess_${Date.now()}`;
    const session = await ClassSession.create({ class_id: classId, session_token: token, started_at: new Date() });
    return res.json({ sessionToken: token, sessionId: session.id });
  } catch (err) {
    console.error('create session', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join session
router.post('/session/join', authRequired, async (req, res) => {
  try {
    const { classId, sessionToken } = req.body;
    const cls = await Classroom.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    // enrollment check could go here
    const participant = await ClassParticipant.create({ class_id: classId, session_token: sessionToken, user_id: req.user.id, role: req.user.role === 'teacher' ? 'host' : 'participant', joined_at: new Date() });
    return res.json({ ok: true, participantId: participant.id });
  } catch (err) {
    console.error('session join', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leave session
router.post('/session/leave', authRequired, async (req, res) => {
  try {
    const { classId, sessionToken } = req.body;
    await ClassParticipant.update({ left_at: new Date() }, { where: { class_id: classId, session_token: sessionToken, user_id: req.user.id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error('session leave', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List participants for a class/session
router.get('/participants/:classId', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const { sessionToken } = req.query;
    const where = { class_id: classId };
    if (sessionToken) where.session_token = sessionToken;
    const rows = await ClassParticipant.findAll({ where, include: [{ model: User, attributes: ['id','name','email'] }], order: [['joined_at','ASC']] });
    return res.json({ participants: rows });
  } catch (err) {
    console.error('participants', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* Resources CRUD */
// List resources
router.get('/:classId/resources', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const items = await ClassResource.findAll({ where: { class_id: classId }, order: [['created_at','DESC']] });
    return res.json({ resources: items });
  } catch (err) {
    console.error('list resources', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create resource (teacher only)
router.post('/:classId/resources', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const cls = await Classroom.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.id !== cls.teacher_id) return res.status(403).json({ error: 'Unauthorized' });
    const { title, type, url, description } = req.body;
    const r = await ClassResource.create({ class_id: classId, title, type, url, description, created_by: req.user.id });
    return res.json({ resource: r });
  } catch (err) {
    console.error('create resource', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update resource
router.put('/:classId/resources/:id', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const id = req.params.id;
    const cls = await Classroom.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.id !== cls.teacher_id) return res.status(403).json({ error: 'Unauthorized' });
    const { title, type, url, description } = req.body;
    await ClassResource.update({ title, type, url, description }, { where: { id, class_id: classId } });
    const updated = await ClassResource.findByPk(id);
    return res.json({ resource: updated });
  } catch (err) {
    console.error('update resource', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete resource
router.delete('/:classId/resources/:id', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const id = req.params.id;
    const cls = await Classroom.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.id !== cls.teacher_id) return res.status(403).json({ error: 'Unauthorized' });
    await ClassResource.destroy({ where: { id, class_id: classId } });
    return res.json({ ok: true });
  } catch (err) {
    console.error('delete resource', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Chat history
router.get('/:classId/chat', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const { sessionToken, limit = 200 } = req.query;
    const where = { class_id: classId };
    if (sessionToken) where.session_token = sessionToken;
    const msgs = await ChatMessage.findAll({ where, order: [['created_at','ASC']], limit: parseInt(limit,10) });
    return res.json({ messages: msgs });
  } catch (err) {
    console.error('chat history', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST chat message (optional - socket also persists)
router.post('/:classId/chat', authRequired, async (req, res) => {
  try {
    const classId = req.params.classId;
    const { sessionToken, text } = req.body;
    const msg = await ChatMessage.create({ class_id: classId, session_token: sessionToken, user_id: req.user.id, user_name: req.user.name, text });
    return res.json({ message: msg });
  } catch (err) {
    console.error('post chat', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
