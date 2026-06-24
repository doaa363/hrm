/**
 * security.js — Global security middleware stack
 * Covers: A05 (Misconfiguration), A03 (Injection), A07 (Auth failures)
 */

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');

// ── Helmet: sets 14 security-related HTTP headers ────────────────────────────
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

// ── General API rate limit: 100 req / 15 min per IP ──────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// ── Auth endpoints: tighter limit to slow brute-force (A07) ──────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' },
  skipSuccessfulRequests: true, // only count failures
});

// ── AI chat: prevent prompt-injection / quota abuse ──────────────────────────
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'AI request limit reached, please slow down.' },
});

module.exports = {
  helmetMiddleware,
  generalLimiter,
  authLimiter,
  aiLimiter,
  // NoSQL injection sanitizer — strips $ and . from req.body/params/query (A03)
  mongoSanitize: mongoSanitize({ replaceWith: '_' }),
  // XSS — sanitizes HTML entities in request body (A03)
  xssClean: xss(),
  // HTTP Parameter Pollution prevention (A03)
  hppClean: hpp(),
};
