/**
 * authorize.js
 * Fine-grained role check middleware (A01 – Broken Access Control)
 *
 * Usage: router.get('/route', protect, authorize('admin', 'manager'), handler)
 */

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthenticated.' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
  }
  return next();
};

module.exports = { authorize };