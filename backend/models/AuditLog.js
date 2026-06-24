/**
 * AuditLog.js — updated schema
 * details is now a Mixed object (structured JSON) instead of a plain string
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    performedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    performedByName: { type: String, required: true },
    action:          { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
    targetModel:     { type: String },
    targetId:        { type: mongoose.Schema.Types.ObjectId },
    details:         { type: mongoose.Schema.Types.Mixed },  // structured object, not a string
    ipAddress:       { type: String },
  },
  { timestamps: true }
);

// Index for fast admin queries
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ targetModel: 1, targetId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
