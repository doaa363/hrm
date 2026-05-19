const AuditLog = require('../models/AuditLog');

// Logs an audit entry for successful JSON responses.
// IMPORTANT: do not call next() until the response method is invoked.
const auditLog = (action, targetModel = null) => (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async (data) => {
    // Only log successful responses
    if (res.statusCode < 400 && req.user) {
      try {
        const currentTime = new Date().toLocaleString('ar-EG');
        const actionAr = action === 'CREATE' ? 'بإنشاء' : action === 'UPDATE' ? 'بتعديل' : 'بحذف';
        const modelAr = targetModel || 'سجل';
        
        await AuditLog.create({
          performedBy: req.user.id,
          performedByName: req.user.name || 'Unknown',
          action,
          targetModel,
          targetId: req.params?.id || data?._id || null,
          details: `المسؤول [${req.user.name || 'Unknown'}] قام ${actionAr} [${modelAr}] في تمام الساعة [${currentTime}]`,
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        });
      } catch (e) {
        console.error('Audit log error:', e.message);
      }
    }

    return originalJson(data);
  };

  return next();
};

module.exports = auditLog;

