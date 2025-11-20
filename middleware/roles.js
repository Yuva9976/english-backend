// middleware/roles.js
// Small helpers to apply role-based checks on routes.
const { authRequired } = require('./auth');

function requireRole(...roles) {
  // Middleware that expects `req.user` already set. Use as [authRequired, requireRole('teacher')]
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

function requireAnyRole(rolesArray) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const ok = rolesArray.some(r => req.user.role === r);
    if (!ok) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

function requireAuthRole(...roles) {
  // Convenience: return an array usable directly in routes: [authRequired, requireRole(...roles)]
  return [authRequired, requireRole(...roles)];
}

module.exports = { requireRole, requireAnyRole, requireAuthRole };
