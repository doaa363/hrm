const AuditLog = require('../models/AuditLog');

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
