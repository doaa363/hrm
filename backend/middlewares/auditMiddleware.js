/**
 * auditMiddleware.js
 * Covers: A09 (Security Logging & Monitoring Failures)
 *
 * Improvements over original:
 * - Async errors in the log writer never crash the request
 * - Sensitive fields (password, token) are stripped before storing details
 * - targetId resolved safely without crashing on missing data
 * - Uses structured log fields — easy to ship to a SIEM
 */

const AuditLog = require('../models/AuditLog');

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apiKey', 'authorization'];

function sanitizeBody(body = {}) {
  const clean = { ...body };
  SENSITIVE_KEYS.forEach((k) => {
    if (clean[k] !== undefined) clean[k] = '[REDACTED]';
  });
  return clean;
}

const auditLog = (action, targetModel = null) => (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async (data) => {
    // Fire-and-forget: never block the response for audit writes
    if (res.statusCode < 400 && req.user) {
      setImmediate(async () => {
        try {
          const targetId =
            req.params?.id ||
            data?._id ||
            data?.leave?._id ||
            data?.attendance?._id ||
            null;

          await AuditLog.create({
            performedBy:     req.user.id,
            performedByName: req.user.name || 'Unknown',
            action,
            targetModel,
            targetId:        targetId || undefined,
            details: {
              method:  req.method,
              path:    req.originalUrl,
              body:    sanitizeBody(req.body),
              outcome: res.statusCode,
            },
            ipAddress:
              req.ip ||
              req.headers['x-forwarded-for']?.split(',')[0].trim() ||
              req.socket?.remoteAddress,
          });
        } catch (e) {
          // Log to console so an external log aggregator can catch it,
          // but never propagate — the client response is already sent.
          console.error('[AuditLog] Write failed:', e.message);
        }
      });
    }

    return originalJson(data);
  };

  return next();
};

module.exports = auditLog;
