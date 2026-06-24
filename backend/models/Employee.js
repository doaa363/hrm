const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee'
    },
    jobRole: {
        type: String,
        default: 'Employee'
    },
    basicSalary: {
        type: Number,
        default: 0
    },
    annualLeaveBalance: {
        type: Number,
        default: 21
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Employee', employeeSchema);