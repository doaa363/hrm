const Attendance = require('../models/Attendance');

// @desc    Check-in (تسجيل حضور)
// @route   POST /api/attendance/checkin
exports.checkIn = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // الحصول على التاريخ الحالي فقط

        // التأكد من أن الموظف لم يسجل حضوراً اليوم بالفعل
        const existingRecord = await Attendance.findOne({
            employee: req.user.id,
            date: today
        });

        if (existingRecord) {
            return res.status(400).json({ message: 'You have already checked in today' });
        }

        const attendance = await Attendance.create({
            employee: req.user.id,
            date: today,
            checkIn: new Date(),
            status: 'Present'
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('dashboardUpdate', { type: 'attendance', action: 'checkin', data: attendance });
        }

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check-out (تسجيل انصراف وحساب الساعات)
// @route   PUT /api/attendance/checkout
exports.checkOut = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({
            employee: req.user.id,
            date: today
        });

        if (!attendance) {
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'You have already checked out today' });
        }

        attendance.checkOut = new Date();
        
        // حساب ساعات العمل (الفرق بين الوقتين بالملي ثانية ثم تحويله لساعات)
        const diffInMs = attendance.checkOut - attendance.checkIn;
        attendance.workingHours = (diffInMs / (1000 * 60 * 60)).toFixed(2); 

        await attendance.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('dashboardUpdate', { type: 'attendance', action: 'checkout', data: attendance });
        }

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employee attendance history
// @route   GET /api/attendance/my-history
exports.getMyAttendance = async (req, res) => {
    try {
        const history = await Attendance.find({ employee: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
