import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, HelpCircle, ArrowLeft, Mail, Phone, Building2, CalendarDays, BadgeCheck, Clock } from 'lucide-react'
import { useAuth } from './context/AuthContext.jsx'

const allEmployees = [
  { id: 1, name: 'Ahmed Mohamed Ali', role: 'Software Development Manager', dept: 'Information Technology', email: 'ahmed.m@company.com', phone: '+966 50 123 4567', date: '2020-03-15', status: 'Active', salary: '$8,500', manager: 'CEO', location: 'Riyadh', leaves: 18, attendance: '96%' },
  { id: 2, name: 'Fatima Ahmed Hassan', role: 'UI/UX Designer', dept: 'Design', email: 'fatima.a@company.com', phone: '+966 55 234 5678', date: '2021-06-20', status: 'Active', salary: '$6,200', manager: 'Ahmed Mohamed Ali', location: 'Riyadh', leaves: 20, attendance: '94%' },
  { id: 3, name: 'Mahmoud Hassan Ibrahim', role: 'Data Analyst', dept: 'Information Technology', email: 'mahmoud.h@company.com', phone: '+966 50 345 6789', date: '2019-11-10', status: 'On Leave', salary: '$7,000', manager: 'Ahmed Mohamed Ali', location: 'Jeddah', leaves: 10, attendance: '88%' },
  { id: 4, name: 'Sara Khalid Mohamed', role: 'HR Manager', dept: 'Human Resources', email: 'sara.k@company.com', phone: '+966 55 456 7890', date: '2018-01-05', status: 'Active', salary: '$7,800', manager: 'CEO', location: 'Riyadh', leaves: 21, attendance: '97%' },
  { id: 5, name: 'Omar Abdullah Saeed', role: 'Frontend Developer', dept: 'Information Technology', email: 'omar.a@company.com', phone: '+966 50 567 8901', date: '2022-08-12', status: 'Active', salary: '$5,500', manager: 'Ahmed Mohamed Ali', location: 'Riyadh', leaves: 19, attendance: '95%' },
  { id: 6, name: 'Laila Mohamed Ahmed', role: 'Sales Manager', dept: 'Sales', email: 'laila.m@company.com', phone: '+966 55 678 9012', date: '2021-02-28', status: 'Active', salary: '$7,200', manager: 'CEO', location: 'Dammam', leaves: 17, attendance: '93%' },
]

function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const emp = allEmployees.find(e => e.id === parseInt(id))
  const currentView = user?.role === 'manager' || user?.role === 'admin' ? 'manager' : 'employee'
  const [confirm, setConfirm] = useState(false)
  const [deactivated, setDeactivated] = useState(false)

  const handleDeactivate = () => {
    setDeactivated(true)
    setConfirm(false)
  }

  if (!emp) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-500 text-lg">Employee not found.</p>
        <button onClick={() => navigate('/employees')} className="mt-4 px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm">Back to Employees</button>
      </div>
    </div>
  )

  const recentActivity = [
    { date: '2026-05-12', action: 'Checked in at 08:55 AM', type: 'attendance' },
    { date: '2026-05-10', action: 'Submitted annual leave request', type: 'leave' },
    { date: '2026-05-08', action: 'Checked in at 09:02 AM', type: 'attendance' },
    { date: '2026-05-05', action: 'Leave request approved', type: 'approved' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col justify-between p-4 shadow-xl z-10 sticky top-0 h-screen">
        <div>
          <div className="text-center py-6 border-b border-gray-700 mb-6">
            <h1 className="text-xl font-bold tracking-wide">HR Management</h1>
            <h1 className="text-xl font-bold tracking-wide text-cyan-400 mt-1">System</h1>
          </div>
          <nav className="space-y-2">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
              <LayoutDashboard size={20} /><span>Dashboard</span>
            </button>
            <button onClick={() => navigate('/employees')} className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-600 rounded-lg text-white font-medium transition">
              <Users size={20} /><span>Employees</span>
            </button>
            <button onClick={() => navigate('/attendance')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
              <Calendar size={20} /><span>Attendance</span>
            </button>
            <button onClick={() => navigate('/reports')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
              <FileText size={20} /><span>Reports</span>
            </button>
            <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
              <Settings size={20} /><span>Settings</span>
            </button>
          </nav>
        </div>
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <button onClick={() => { localStorage.removeItem('token'); navigate('/') }} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition">
            <LogOut size={20} /><span>Logout</span>
          </button>
          <div className="flex justify-end text-gray-500 hover:text-gray-300 cursor-pointer">
            <HelpCircle size={20} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex gap-2">
            <span className="px-4 py-1.5 text-sm font-medium rounded-md shadow-sm transition bg-[#1e293b] text-white">
              {currentView === 'manager' ? 'Manager View' : 'Employee View'}
            </span>
          </div>
          <div className="w-9 h-9 bg-indigo-900 text-white flex items-center justify-center rounded-full font-bold shadow-sm uppercase">
            {user?.name?.[0] || user?.email?.[0] || 'A'}
          </div>
        </header>

        {/* Back Button */}
        <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft size={16} /> Back to Employees
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm">
              {emp.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-800">{emp.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  deactivated ? 'bg-red-50 text-red-500 border-red-100' :
                  emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {deactivated ? 'Deactivated' : emp.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{emp.role}</p>
              <p className="text-gray-400 text-xs mt-1">{emp.dept}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact & Work Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Contact & Work Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Mail size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-700">{emp.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><Phone size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-700">{emp.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Building2 size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400">Department</p>
                    <p className="text-sm font-medium text-gray-700">{emp.dept}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CalendarDays size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400">Join Date</p>
                    <p className="text-sm font-medium text-gray-700">{emp.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BadgeCheck size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400">Direct Manager</p>
                    <p className="text-sm font-medium text-gray-700">{emp.manager}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Clock size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-medium text-gray-700">{emp.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full ${act.type === 'attendance' ? 'bg-cyan-500' : act.type === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{act.action}</p>
                      <p className="text-xs text-gray-400">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-400 mb-1">Monthly Salary</p>
              <h3 className="text-2xl font-bold text-gray-800">{emp.salary}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-400 mb-1">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-emerald-600">{emp.attendance}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-400 mb-1">Leave Balance</p>
              <h3 className="text-2xl font-bold text-cyan-600">{emp.leaves} days</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-400 mb-2">Quick Actions</p>
              <div className="space-y-2">
                <button onClick={() => navigate('/settings')} className="w-full px-4 py-2 bg-[#1e293b] hover:bg-slate-800 text-white text-sm rounded-lg transition">Edit Profile</button>
                <button onClick={() => navigate('/attendance')} className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition">View Attendance</button>
                <button onClick={() => setConfirm(true)} className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg transition" disabled={deactivated}>
                  {deactivated ? 'Deactivated' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Confirm Modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-gray-800 mb-2">Deactivate Employee</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to deactivate <span className="font-semibold text-gray-700">{emp.name}</span>? This action can be undone later.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition">Cancel</button>
              <button onClick={handleDeactivate} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDetail
