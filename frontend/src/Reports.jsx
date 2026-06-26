import React, { useState } from 'react'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, HelpCircle, Download, TrendingUp, TrendingDown, Lock } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import PageLayout from './components/PageLayout.jsx'

function Reports() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const currentView = user?.role === 'manager' || user?.role === 'admin' ? 'manager' : 'employee'
  const [activeReport, setActiveReport] = useState('attendance')
  const [exported, setExported] = useState(false)

  const attendanceData = [
    { month: 'Jan', present: 92, absent: 8 },
    { month: 'Feb', present: 88, absent: 12 },
    { month: 'Mar', present: 95, absent: 5 },
    { month: 'Apr', present: 90, absent: 10 },
    { month: 'May', present: 94, absent: 6 },
  ]

  const leaveData = [
    { month: 'Jan', annual: 20, sick: 10, casual: 8 },
    { month: 'Feb', annual: 15, sick: 14, casual: 6 },
    { month: 'Mar', annual: 25, sick: 8, casual: 10 },
    { month: 'Apr', annual: 18, sick: 12, casual: 7 },
    { month: 'May', annual: 22, sick: 9, casual: 5 },
  ]

  const salaryData = [
    { month: 'Jan', total: 420000 },
    { month: 'Feb', total: 435000 },
    { month: 'Mar', total: 428000 },
    { month: 'Apr', total: 445000 },
    { month: 'May', total: 450000 },
  ]

  const exportCSV = () => {
    let headers = []
    let rows = []

    if (activeReport === 'attendance') {
      headers = ['Month', 'Present %', 'Absent %']
      rows = attendanceData.map(r => [r.month, r.present, r.absent])
    } else if (activeReport === 'leave') {
      headers = ['Month', 'Annual Leave', 'Sick Leave', 'Casual Leave']
      rows = leaveData.map(r => [r.month, r.annual, r.sick, r.casual])
    } else {
      headers = ['Month', 'Total Payroll ($)']
      rows = salaryData.map(r => [r.month, r.total])
    }

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeReport}_report.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  const summaryCards = [
    { label: 'Avg Attendance Rate', value: '91.8%', trend: '+2.3%', up: true },
    { label: 'Total Leave Days', value: '184', trend: '-5 days', up: false },
    { label: 'Monthly Payroll', value: '$450K', trend: '+1.1%', up: true },
    { label: 'Active Employees', value: '150', trend: '+5', up: true },
  ]

  const reportTabs = [
    { id: 'attendance', label: 'Attendance Report' },
    { id: 'leave', label: 'Leave Report' },
    { id: 'salary', label: 'Salary Report' },
  ]

  return (
    <PageLayout>
      <Sidebar active="reports" />
      <main className="p-8">

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

        {currentView === 'employee' ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Lock size={48} className="mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700">Access Restricted</h3>
            <p className="text-sm mt-2">You need manager privileges to view company reports.</p>
          </div>
        ) : (
          <>
            {/* Page Title */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
                <p className="text-sm text-gray-500 mt-1">Monthly analytics and performance overview</p>
              </div>
              <div className="flex items-center gap-3">
                {exported && <span className="text-sm text-emerald-600 font-medium">✓ Downloaded!</span>}
                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b] hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition shadow-sm">
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {summaryCards.map((card, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
                  <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${card.up ? 'text-emerald-500' : 'text-red-400'}`}>
                    {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {card.trend}
                  </p>
                </div>
              ))}
            </section>

            {/* Report Tabs */}
            <div className="flex gap-2 mb-6">
              {reportTabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveReport(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeReport === tab.id ? 'bg-[#1e293b] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

              {activeReport === 'attendance' && (
                <>
                  <h4 className="text-base font-bold text-gray-800 mb-6">Monthly Attendance Overview</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                        <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="present" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={30} name="Present %" />
                        <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} name="Absent %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-4 text-xs justify-center">
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 bg-cyan-500 rounded-sm"></span>Present %</span>
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 bg-red-400 rounded-sm"></span>Absent %</span>
                  </div>
                </>
              )}

              {activeReport === 'leave' && (
                <>
                  <h4 className="text-base font-bold text-gray-800 mb-6">Monthly Leave Breakdown</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leaveData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                        <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="annual" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={20} name="Annual" />
                        <Bar dataKey="sick" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} name="Sick" />
                        <Bar dataKey="casual" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} name="Casual" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-4 text-xs justify-center">
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 bg-indigo-900 rounded-sm"></span>Annual</span>
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 bg-cyan-500 rounded-sm"></span>Sick</span>
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 bg-amber-400 rounded-sm"></span>Casual</span>
                  </div>
                </>
              )}

              {activeReport === 'salary' && (
                <>
                  <h4 className="text-base font-bold text-gray-800 mb-6">Monthly Payroll Trend</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salaryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                        <YAxis axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} />
                        <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                        <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 3, r: 4 }} name="Payroll" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-4 text-xs justify-center">
                    <span className="flex items-center gap-1.5 text-cyan-600"><span className="w-3 h-3 bg-cyan-500 rounded-full"></span>Total Payroll ($)</span>
                  </div>
                </>
              )}

            </div>
          </>
        )}
      </main>
    </PageLayout>
  )
}
