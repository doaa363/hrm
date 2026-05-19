const express = require('express');
const router = express.Router();
const { requestLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorize');
const auditLog = require('../middlewares/auditMiddleware');

// مسار للموظف لطلب الإجازة
router.post('/request', protect, authorize('admin', 'manager', 'employee'), auditLog('CREATE', 'Leave'), requestLeave);

// مسار للـ HR فقط للموافقة أو الرفض
router.put('/status/:id', protect, authorize('admin', 'manager'), auditLog('UPDATE', 'Leave'), updateLeaveStatus);

module.exports = router;

