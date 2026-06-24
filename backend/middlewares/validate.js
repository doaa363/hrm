/**
 * validate.js — Request body / params validation
 * Covers: A03 (Injection), A04 (Insecure Design)
 *
 * Uses Joi schemas so every route rejects malformed input
 * before it ever reaches a controller or the database.
 */

const Joi = require('joi');

// ── Schema definitions ────────────────────────────────────────────────────────

const schemas = {
  register: Joi.object({
    name:               Joi.string().trim().min(2).max(100).required(),
    email:              Joi.string().email().lowercase().required(),
    password:           Joi.string().min(8).max(128).required(),
    jobRole:            Joi.string().trim().max(100).optional(),
    basicSalary:        Joi.number().min(0).optional(),
    annualLeaveBalance: Joi.number().min(0).max(365).optional(),
    role:               Joi.string().valid('admin', 'manager', 'employee').optional(),
  }),

  login: Joi.object({
    email:    Joi.string().email().lowercase().required(),
    password: Joi.string().min(1).max(128).required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().min(1).max(128).required(),
    newPassword:     Joi.string().min(8).max(128).required(),
  }),

  leaveRequest: Joi.object({
    leaveType: Joi.string().valid('Annual', 'Sick', 'Unpaid').required(),
    startDate: Joi.date().iso().required(),
    endDate:   Joi.date().iso().min(Joi.ref('startDate')).required(),
    reason:    Joi.string().trim().max(500).optional(),
  }),

  leaveStatus: Joi.object({
    status: Joi.string().valid('Approved', 'Rejected').required(),
  }),

  aiChat: Joi.object({
    message: Joi.string().trim().min(1).max(2000).required(),
    history: Joi.array()
      .items(
        Joi.object({
          role: Joi.string().valid('user', 'model').required(),
          text: Joi.string().trim().max(2000).required(),
        })
      )
      .max(20)   // cap history depth to prevent prompt-injection bloat
      .optional(),
  }),
};

// ── Middleware factory ────────────────────────────────────────────────────────

/**
 * validate(schemaName)
 * Returns Express middleware that validates req.body against the named schema.
 * On failure: 422 Unprocessable Entity with structured error list.
 */
const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) {
    return res.status(500).json({ message: `Unknown validation schema: ${schemaName}` });
  }

  const { error, value } = schema.validate(req.body, {
    abortEarly:   false,   // collect all errors, not just the first
    stripUnknown: true,    // remove unexpected fields silently
    convert:      true,    // coerce types (e.g. date strings)
  });

  if (error) {
    const details = error.details.map((d) => d.message.replace(/"/g, "'"));
    return res.status(422).json({ message: 'Validation failed.', errors: details });
  }

  req.body = value; // replace with sanitized, coerced body
  return next();
};

module.exports = { validate };
