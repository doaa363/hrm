import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, CheckCircle2, Clock, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import socket from './utils/socket.js'
import { CardSkeleton, ChartSkeleton } from './components/Skeleton.jsx'
import Sidebar from './components/Sidebar.jsx'

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const currentView = user?.role === 'manager' || user?.role === 'admin' ? 'manager' : 'employee'
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    totalEmployees: 150,
    todaysAttendance: 142,
    pendingLeaves: 8,
    monthlyReports: 24
  })

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    // Listen for real-time updates
    socket.on('dashboardUpdate', (event) => {
      if (event.type === 'attendance') {
        setStats(prev => ({ ...prev, todaysAttendance: prev.todaysAttendance + 1 }))
      } else if (event.type === 'leave') {
        if (event.action === 'request') {
          setStats(prev => ({ ...prev, pendingLeaves: prev.pendingLeaves + 1 }))
        } else if (event.action === 'status_update') {
          setStats(prev => ({ ...prev, pendingLeaves: Math.max(0, prev.pendingLeaves - 1) }))
        }
      }
    })

    return () => {
      clearTimeout(timer)
      socket.off('dashboardUpdate')
    }
  }, [])

  const attendanceData = [
    { name: 'Saturday', present: 90 },
    { name: 'Sunday', present: 85 },
    { name: 'Monday', present: 95 },
    { name: 'Tuesday', present: 80 },
    { name: 'Wednesday', present: 88 },
  ]

  const productivityData = [
    { name: 'Week 1', productivity: 82 },
    { name: 'Week 2', productivity: 86 },
    { name: 'Week 3', productivity: 92 },
    { name: 'Week 4', productivity: 89 },
  ]

  const leaveTypesData = [
    { name: 'Annual Leave', count: 85 },
    { name: 'Sick Leave', count: 45 },
    { name: 'Casual Leave', count: 30 },
    { name: 'Unpaid Leave', count: 12 },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      <Sidebar active="dashboard" />

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
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of the HR Management System</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="mb-8"><CardSkeleton count={currentView === 'manager' ? 4 : 2} /></div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {currentView === 'manager' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Employees</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEmployees}</h3>
                  <p className="text-xs text-green-500 font-medium mt-1">↑ 5+ this month</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={24} /></div>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{currentView === 'manager' ? "Today's Attendance" : "My Attendance Rate"}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{currentView === 'manager' ? stats.todaysAttendance : "96%"}</h3>
                <p className="text-xs text-green-500 font-medium mt-1">↑ {currentView === 'manager' ? "94.6%" : "Excellent"}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{currentView === 'manager' ? "Pending Leave Requests" : "Available Leave"}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{currentView === 'manager' ? stats.pendingLeaves : "18 Days"}</h3>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><Clock size={24} /></div>
            </div>

            {currentView === 'manager' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Monthly Reports</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.monthlyReports}</h3>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FileText size={24} /></div>
              </div>
            )}
          </section>
        )}

        {/* Attendance Chart + Leave Requests */}
        {loading ? (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2"><ChartSkeleton /></div>
            <div><ChartSkeleton /></div>
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-base font-bold text-gray-800">Attendance Overview - This Week</h4>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 bg-cyan-500 rounded-sm"></span> Present</span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="present" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {currentView === 'manager' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-base font-bold text-gray-800 mb-6">Pending Leave Requests</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 text-sm">Ahmed Mohamed</span>
                      <span className="text-xs px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">Pending</span>
                    </div>
                    <p className="text-xs text-gray-500">Annual Leave</p>
                    <p className="text-[11px] text-gray-400">05-05-2026 to 10-05-2026</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 text-sm">Fatima Ali</span>
                      <span className="text-xs px-2.5 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-full">Approved</span>
                    </div>
                    <p className="text-xs text-gray-500">Sick Leave</p>
                    <p className="text-[11px] text-gray-400">03-05-2026 to 04-05-2026</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 text-sm">Mahmoud Hassan</span>
                      <span className="text-xs px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">Pending</span>
                    </div>
                    <p className="text-xs text-gray-500">Casual Leave</p>
                    <p className="text-[11px] text-gray-400">07-05-2026 to 07-05-2026</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Productivity + Leave Types */}
        {loading ? (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h4 className="text-base font-bold text-gray-800 mb-6">Weekly Productivity Index</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="productivity" stroke="#0ea5e9" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 3, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-2 text-xs text-cyan-600 mt-2">
                <span>● Productivity %</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h4 className="text-base font-bold text-gray-800 mb-6">Leave Types Submitted</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveTypesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={11} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </section>
        )}
      </main>
    </div>
  )
}

export default Dashboard
