/**
 * errorHandler.js — Centralised error handling
 * Covers: A05 (Security Misconfiguration) — never leak stack traces to clients
 */

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Always log the full error server-side
  console.error('[ErrorHandler]', {
    message: err.message,
    stack:   process.env.NODE_ENV === 'production' ? '[hidden]' : err.stack,
    path:    req.originalUrl,
    method:  req.method,
    user:    req.user?.id || 'unauthenticated',
  });

  const statusCode = err.statusCode || err.status || 500;

  // Never expose internal details in production
  const clientMessage =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred.'
      : err.message || 'An unexpected error occurred.';

  return res.status(statusCode).json({ error: clientMessage });
};

module.exports = errorHandler;
