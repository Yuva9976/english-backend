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
    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
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
    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admin-login', async (req, res) => {
  try {
    const body = getBody(req);
    console.log('ADMIN LOGIN request body:', body);
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required in JSON body' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check if user is admin or teacher
    if (!['admin', 'teacher'].includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error('admin login error', err);
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

// Forgot password - sends reset link
router.post('/forgot-password', async (req, res) => {
  try {
    const body = getBody(req);
    const email = body.email;

    if (!email) {
      return res.status(400).json({ error: 'email required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If account exists, reset link sent to email' });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // In production, send email with reset link
    // For now, just log it and return the token
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log(`📧 Password reset link for ${email}:\n${resetLink}`);

    res.json({ 
      message: 'If account exists, reset link sent to email',
      // Return token for testing (remove in production when email is set up)
      resetToken,
      resetLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    });
  } catch (err) {
    console.error('forgot password error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password - validates token and updates password
router.post('/reset-password', async (req, res) => {
  try {
    const body = getBody(req);
    const token = body.token;
    const password = body.password;

    if (!token || !password) {
      return res.status(400).json({ error: 'token and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired reset link' });
    }

    // Find user by ID from token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Update password
    const hash = await bcrypt.hash(password, 10);
    await user.update({ password_hash: hash });

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('reset password error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
