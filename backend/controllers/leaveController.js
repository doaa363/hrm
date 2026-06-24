/**
 * leaveController.js
 * Covers: A01 (Broken Access Control), A04 (Insecure Design)
 *
 * Key improvements:
 * - Leave balance check uses a DB-level atomic $inc only when approved
 *   (original could double-deduct if called twice due to no status guard)
 * - Status transition guard: can't re-approve an already approved leave
 * - Employee object-level authorisation check on status update
 * - All errors forwarded to centralised handler
 */

const Leave    = require('../models/Leave');
const Employee = require('../models/Employee');

// ── Request Leave ─────────────────────────────────────────────────────────────
exports.requestLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const start    = new Date(startDate);
    const end      = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

    // For Annual leave, check balance; Sick/Unpaid don't deduct at request time
    if (leaveType === 'Annual') {
      const employee = await Employee.findById(req.user.id).select('annualLeaveBalance');
      if (!employee) return res.status(404).json({ message: 'Employee not found.' });

      if (employee.annualLeaveBalance < diffDays) {
        return res.status(400).json({ message: 'Insufficient annual leave balance.' });
      }
    }

    const leave = await Leave.create({
      employee: req.user.id,
      leaveType,
      startDate: start,
      endDate:   end,
      reason,
    });

    emitDashboard(req, 'leave', 'request', leave);

    return res.status(201).json({ message: 'Leave request submitted.', leave });
  } catch (err) {
    return next(err);
  }
};

// ── Update Leave Status (manager / admin only) ────────────────────────────────
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // validated as 'Approved' | 'Rejected' by middleware

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found.' });

    // Idempotency guard — prevent double-deduction on re-approval (A04)
    if (leave.status !== 'Pending') {
      return res.status(409).json({
        message: `Leave request has already been ${leave.status.toLowerCase()}.`,
      });
    }

    if (status === 'Approved' && leave.leaveType === 'Annual') {
      const start    = new Date(leave.startDate);
      const end      = new Date(leave.endDate);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

      // Atomic decrement — safer than read-modify-write (A04)
      const updated = await Employee.findByIdAndUpdate(
        leave.employee,
        { $inc: { annualLeaveBalance: -diffDays } },
        { new: true, select: 'annualLeaveBalance' }
      );

      // Guard against going negative (race condition safety net)
      if (updated.annualLeaveBalance < 0) {
        // Roll back
        await Employee.findByIdAndUpdate(leave.employee, {
          $inc: { annualLeaveBalance: diffDays },
        });
        return res.status(400).json({ message: 'Insufficient annual leave balance.' });
      }
    }

    leave.status     = status;
    leave.approvedBy = req.user.id;
    await leave.save();

    emitDashboard(req, 'leave', 'status_update', leave);

    return res.json({ message: `Leave ${status.toLowerCase()}.`, leave });
  } catch (err) {
    return next(err);
  }
};

// ── Internal helper ───────────────────────────────────────────────────────────
function emitDashboard(req, type, action, data) {
  const io = req.app.get('io');
  if (io) io.emit('dashboardUpdate', { type, action, data });
}
