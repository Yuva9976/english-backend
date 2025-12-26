const express = require('express')
const router = express.Router()
const { Attendance, User } = require('../models')
const { Op } = require('sequelize')
const { authRequired, requireRole } = require('../middleware/auth')

// Bulk attendance upsert
// POST /api/attendance/bulk
// body: { attendance: [{ userId, date, status, note, lessonId, sessionId }, ...] }
router.post('/bulk', authRequired, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const items = Array.isArray(req.body.attendance) ? req.body.attendance : []
    if (items.length === 0) return res.status(400).json({ error: 'attendance array required' })

    const results = []
    for (const it of items) {
      const { userId, date, status = 'present', note, lessonId, sessionId } = it
      if (!userId || !date) {
        results.push({ ok: false, reason: 'missing userId or date', item: it })
        continue
      }

      const where = { user_id: userId, date }
      if (lessonId) where.lesson_id = String(lessonId)
      if (sessionId) where.session_id = String(sessionId)

      const [rec, created] = await Attendance.findOrCreate({ where, defaults: { user_id: userId, date, status, note, lesson_id: lessonId ? String(lessonId) : null, session_id: sessionId ? String(sessionId) : null } })
      if (!created) {
        rec.status = status
        rec.note = note
        if (lessonId) rec.lesson_id = String(lessonId)
        if (sessionId) rec.session_id = String(sessionId)
        await rec.save()
      }
      results.push({ ok: true, attendance: rec })
    }

    return res.json({ results })
  } catch (err) {
    console.error('attendance bulk error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Record attendance for a user
// POST /api/attendance/record
// body: { userId, date: 'YYYY-MM-DD', status: 'present'|'absent'|'late'|'excused', note }
// Teachers/admins can record for any user. Learners may record only for themselves.
router.post('/record', authRequired, async (req, res) => {
  try {
    const { userId, date, status = 'present', note, lessonId, sessionId } = req.body
    if (!userId || !date) return res.status(400).json({ error: 'userId and date are required' })

    const targetUser = await User.findByPk(userId)
    if (!targetUser) return res.status(404).json({ error: 'User not found' })

    // Authorization: teacher/admin can mark any user; learner can only mark themselves
    if (!['teacher', 'admin'].includes(req.user.role)) {
      if (req.user.role === 'learner' && req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }

    // upsert: find existing record for user+date (+lesson/session if provided)
    const whereClause = { user_id: userId, date }
    if (lessonId) whereClause.lesson_id = String(lessonId)
    if (sessionId) whereClause.session_id = String(sessionId)

    const [record, created] = await Attendance.findOrCreate({
      where: whereClause,
      defaults: { user_id: userId, date, status, note, lesson_id: lessonId ? String(lessonId) : null, session_id: sessionId ? String(sessionId) : null }
    })

    if (!created) {
      record.status = status
      record.note = note
      if (lessonId) record.lesson_id = String(lessonId)
      if (sessionId) record.session_id = String(sessionId)
      await record.save()
    }

    return res.json({ ok: true, attendance: record })
  } catch (err) {
    console.error('attendance record error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/attendance/user/:userId?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/user/:userId', authRequired, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10)
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid userId' })

    // learners can only view their own attendance
    if (req.user.role === 'learner' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const { from, to } = req.query
    const where = { user_id: userId }
    if (from && to) {
      where.date = { [Op.gte]: from, [Op.lte]: to }
    } else if (from) {
      where.date = { [Op.gte]: from }
    } else if (to) {
      where.date = { [Op.lte]: to }
    }

    const records = await Attendance.findAll({ where, order: [['date', 'DESC']] })
    return res.json({ userId, records })
  } catch (err) {
    console.error('attendance list error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
