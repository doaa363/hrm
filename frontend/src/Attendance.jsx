import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, HelpCircle, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { TableSkeleton } from './components/Skeleton.jsx'

function Attendance() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const currentView = user?.role === 'manager' || user?.role === 'admin' ? 'manager' : 'employee'
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const attendanceRecords = [
    { id: 1, name: 'Ahmed Mohamed Ali', role: 'Software Development Manager', dept: 'Information Technology', date: '2026-05-12', checkIn: '08:55 AM', checkOut: '05:10 PM', hours: '8.25', status: 'Present' },
    { id: 2, name: 'Fatima Ahmed Hassan', role: 'UI/UX Designer', dept: 'Design', date: '2026-05-12', checkIn: '09:10 AM', checkOut: '05:00 PM', hours: '7.83', status: 'Present' },
    { id: 3, name: 'Mahmoud Hassan Ibrahim', role: 'Data Analyst', dept: 'Information Technology', date: '2026-05-12', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' },
    { id: 4, name: 'Sara Khalid Mohamed', role: 'HR Manager', dept: 'Human Resources', date: '2026-05-12', checkIn: '09:45 AM', checkOut: '05:00 PM', hours: '7.25', status: 'Late' },
    { id: 5, name: 'Omar Abdullah Saeed', role: 'Frontend Developer', dept: 'Information Technology', date: '2026-05-12', checkIn: '08:50 AM', checkOut: '05:05 PM', hours: '8.25', status: 'Present' },
    { id: 6, name: 'Laila Mohamed Ahmed', role: 'Sales Manager', dept: 'Sales', date: '2026-05-12', checkIn: '09:00 AM', checkOut: '05:00 PM', hours: '8.00', status: 'Present' },
  ]

  const filtered = filter === 'All' ? attendanceRecords : attendanceRecords.filter(r => r.status === filter)

  const statusStyle = (status) => {
    if (status === 'Present') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    if (status === 'Absent') return 'bg-red-50 text-red-500 border-red-100'
    return 'bg-amber-50 text-amber-600 border-amber-100'
  }

  const statusIcon = (status) => {
    if (status === 'Present') return <CheckCircle2 size={14} />
    if (status === 'Absent') return <XCircle size={14} />
    return <Clock size={14} />
  }

  const total = attendanceRecords.length
  const present = attendanceRecords.filter(r => r.status === 'Present').length
  const absent = attendanceRecords.filter(r => r.status === 'Absent').length
  const late = attendanceRecords.filter(r => r.status === 'Late').length

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
            <button onClick={() => navigate('/employees')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
              <Users size={20} /><span>Employees</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-600 rounded-lg text-white font-medium transition">
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

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage daily employee attendance</p>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400">Total</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{total}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400">Present</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-1">{present}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400">Absent</p>
            <h3 className="text-3xl font-bold text-red-500 mt-1">{absent}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-400">Late</p>
            <h3 className="text-3xl font-bold text-amber-500 mt-1">{late}</h3>
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['All', 'Present', 'Absent', 'Late'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-[#1e293b] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Attendance Table */}
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-medium text-sm border-b border-gray-100">
                  <th className="p-4 text-left pl-6">Employee</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Check In</th>
                  <th className="p-4 text-left">Check Out</th>
                  <th className="p-4 text-left">Hours</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {rec.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{rec.name}</p>
                        <p className="text-xs text-gray-400">{rec.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{rec.dept}</td>
                  <td className="p-4 text-gray-500">{rec.date}</td>
                  <td className="p-4 text-gray-700">{rec.checkIn}</td>
                  <td className="p-4 text-gray-700">{rec.checkOut}</td>
                  <td className="p-4 text-gray-700">{rec.hours}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(rec.status)}`}>
                      {statusIcon(rec.status)} {rec.status}
                    </span>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No attendance records found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Attendance
