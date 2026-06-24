/**
 * routes/auth.js
 * Covers: A07 — auth limiter applied to login & register
 */
const express = require('express');
const router  = express.Router();

const { register, login, getMe, changePassword } = require('../controllers/authController');
const { protect, adminOnly }                      = require('../middlewares/authMiddleware');
const { validate }                                = require('../middlewares/validate');
const { authLimiter }                             = require('../middlewares/security');

router.post('/register',         protect, adminOnly, validate('register'),       register);
router.post('/login',            authLimiter,         validate('login'),           login);
router.get ('/me',               protect,                                          getMe);
router.put ('/change-password',  protect,             validate('changePassword'),  changePassword);

module.exports = router;
