const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { authRequired, requireRole } = require('../middleware/auth')

// GET /api/users?role=learner
router.get('/', authRequired, async (req, res) => {
  try {
    const role = req.query.role || null
    // If requesting non-learner roles, enforce teacher/admin
    if (role && role !== 'learner' && !['teacher','admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const where = {}
    if (role) where.role = role
    const users = await User.findAll({ where, attributes: ['id','name','email','role'], order: [['name','ASC']] })
    res.json({ users })
  } catch (err) {
    console.error('users list error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
