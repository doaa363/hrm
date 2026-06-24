/**
 * authMiddleware.js
 * Covers: A07 (Identification & Authentication Failures)
 *
 * Improvements over original:
 * - Algorithm pinned to HS256 (prevents "alg: none" attack)
 * - Token extracted + verified in one hardened call
 * - req.user carries only the minimum claims needed downstream
 * - Role helpers consolidated here
 */

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Pin algorithm — prevents attacker from crafting tokens with alg:none (A02)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // Expose only what routes actually need — least-privilege principle
    req.user = {
      id:   decoded.id,
      role: decoded.role,
      name: decoded.name || 'Unknown',
    };

    return next();
  } catch (err) {
    // Unified error message — never leak whether the token is expired vs tampered
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// ── Role guards ───────────────────────────────────────────────────────────────

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only.' });
  }
  return next();
};

const managerOrAdmin = (req, res, next) => {
  if (!['admin', 'manager'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Manager or Admin access only.' });
  }
  return next();
};

module.exports = { protect, adminOnly, managerOrAdmin };
