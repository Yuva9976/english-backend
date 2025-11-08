// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authRequired } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const TOKEN_EXPIRES = '7d';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

// Helper to normalize incoming body safely
function getBody(req) {
  return (req && req.body) ? req.body : {};
}

router.post('/register', async (req, res) => {
  try {
    const body = getBody(req);
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const role = body.role;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required in JSON body' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash: hash, role: role || 'learner' });

    const token = generateToken({ id: user.id, role: user.role });
    // cookie settings: in production set secure:true and proper domain
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const body = getBody(req);
    console.log('LOGIN request body:', body); // helpful debug output
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required in JSON body' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

// get current logged-in user
router.get('/me', authRequired, async (req, res) => {
  const user = req.user;
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
