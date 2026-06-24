const Attendance = require('../models/Attendance');
exports.checkIn = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
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
exports.getMyAttendance = async (req, res) => {
    try {
        const history = await Attendance.find({ employee: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
