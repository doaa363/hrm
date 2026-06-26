/**
 * app.js — Express application bootstrap
 *
 * Security middleware applied in order:
 *  1. Helmet       (secure headers)
 *  2. CORS         (origin whitelist)
 *  3. Rate limiter (all routes)
 *  4. Body parsing with size cap (A06 – prevents large-payload DoS)
 *  5. NoSQL injection sanitizer
 *  6. XSS sanitizer
 *  7. HPP (HTTP Parameter Pollution)
 *  8. Routes
 *  9. Centralised error handler (must be last)
 */

const express  = require('express');
const cors     = require('cors');

const {
  helmetMiddleware,
  generalLimiter,
  mongoSanitize,
  xssClean,
  hppClean,
} = require('./middlewares/security');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes       = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes      = require('./routes/leave');
const auditRoutes      = require('./routes/audit');
const aiRoutes         = require('./routes/ai');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.set('trust proxy', 1); // required for accurate IP behind reverse proxy
app.use(helmetMiddleware);

// ── CORS — whitelist only known origins ───────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight for all routes

// ── Rate limit all routes ─────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Body parsing — cap at 10 kb to prevent payload flooding ──────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── Input sanitization ────────────────────────────────────────────────────────
app.use(mongoSanitize); // NoSQL injection
app.use(xssClean);      // XSS
app.use(hppClean);      // HTTP Parameter Pollution

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves',     leaveRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/ai',         aiRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;