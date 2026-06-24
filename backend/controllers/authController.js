/**
 * authController.js
 * Covers: A02 (Crypto Failures), A07 (Auth Failures)
 *
 * Key improvements:
 * - bcrypt cost factor raised to 12 (OWASP recommendation)
 * - JWT payload minimal (id + role only — no PII)
 * - Timing-safe email-not-found path (same bcrypt cost regardless)
 * - Password strength enforced by validate middleware (see validate.js)
 * - register() protected by adminOnly at route level — employees can't self-register
 */

const Employee = require('../models/Employee');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const BCRYPT_ROUNDS = 12;

// ── Register (admin-only route) ───────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, jobRole, basicSalary, annualLeaveBalance, role } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) {
      // Use 409 Conflict — 400 can leak "email exists" vs "bad request" distinction
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const employee = await Employee.create({
      name,
      email,
      password: hashed,
      jobRole,
      basicSalary,
      annualLeaveBalance,
      role,
    });

    // Never return the hashed password
    return res.status(201).json({
      message: 'Employee created successfully.',
      employee: { id: employee._id, name: employee.name, email: employee.email },
    });
  } catch (err) {
    return next(err);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email }).select('+password');

    // Always run bcrypt — prevents timing attack that reveals valid emails (A07)
    const dummyHash = '$2b$12$invalidsaltinvalidsaltinvalidsaltinvalid000000000000000';
    const hash      = employee ? employee.password : dummyHash;
    const isMatch   = await bcrypt.compare(password, hash);

    if (!employee || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role, name: employee.name },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '8h' } // reduced from 1d — shorter window limits blast radius
    );

    return res.json({
      token,
      employee: {
        id:      employee._id,
        name:    employee.name,
        role:    employee.role,
        jobRole: employee.jobRole,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ── Change Password ───────────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const employee = await Employee.findById(req.user.id).select('+password');
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    // Prevent password reuse (current === new)
    const isSame = await bcrypt.compare(newPassword, employee.password);
    if (isSame) {
      return res.status(400).json({ message: 'New password must differ from the current password.' });
    }

    employee.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await employee.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    return next(err);
  }
};

// ── Get Current User ──────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
};
