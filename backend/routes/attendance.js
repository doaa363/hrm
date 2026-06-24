const express    = require('express');
const router     = express.Router();
const { checkIn, checkOut, getMyAttendance } = require('../controllers/attendanceController');
const { protect }  = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorize');
const auditLog   = require('../middlewares/auditMiddleware');

router.post('/checkin',    protect, authorize('admin', 'manager', 'employee'), auditLog('CREATE', 'Attendance'), checkIn);
router.put('/checkout',    protect, authorize('admin', 'manager', 'employee'), auditLog('UPDATE', 'Attendance'), checkOut);
router.get('/my-history',  protect, authorize('admin', 'manager', 'employee'), getMyAttendance);

module.exports = router;
