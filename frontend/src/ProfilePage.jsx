import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, CalendarDays, Award, User, Shield, DollarSign, Clock, HelpCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from './context/AuthContext.jsx'
import Sidebar from './components/Sidebar.jsx'

const allEmployees = [
  { id: 1, name: 'Ahmed Mohamed Ali', role: 'Software Development Manager', dept: 'Information Technology', email: 'ahmed.m@company.com', phone: '+966 50 123 4567', date: '2020-03-15', status: 'Active', salary: '$8,500', manager: 'CEO', location: 'Riyadh', leaves: 18, attendance: '96%' },
  { id: 2, name: 'Fatima Ahmed Hassan', role: 'UI/UX Designer', dept: 'Design', email: 'fatima.a@company.com', phone: '+966 55 234 5678', date: '2021-06-20', status: 'Active', salary: '$6,200', manager: 'Ahmed Mohamed Ali', location: 'Riyadh', leaves: 20, attendance: '94%' },
  { id: 3, name: 'Mahmoud Hassan Ibrahim', role: 'Data Analyst', dept: 'Information Technology', email: 'mahmoud.h@company.com', phone: '+966 50 345 6789', date: '2019-11-10', status: 'On Leave', salary: '$7,000', manager: 'Ahmed Mohamed Ali', location: 'Jeddah', leaves: 10, attendance: '88%' },
  { id: 4, name: 'Sara Khalid Mohamed', role: 'HR Manager', dept: 'Human Resources', email: 'sara.k@company.com', phone: '+966 55 456 7890', date: '2018-01-05', status: 'Active', salary: '$7,800', manager: 'CEO', location: 'Riyadh', leaves: 21, attendance: '97%' },
  { id: 5, name: 'Omar Abdullah Saeed', role: 'Frontend Developer', dept: 'Information Technology', email: 'omar.a@company.com', phone: '+966 50 567 8901', date: '2022-08-12', status: 'Active', salary: '$5,500', manager: 'Ahmed Mohamed Ali', location: 'Riyadh', leaves: 19, attendance: '95%' },
  { id: 6, name: 'Laila Mohamed Ahmed', role: 'Sales Manager', dept: 'Sales', email: 'laila.m@company.com', phone: '+966 55 678 9012', date: '2021-02-28', status: 'Active', salary: '$7,200', manager: 'CEO', location: 'Dammam', leaves: 17, attendance: '93%' },
]

function ProfilePage() {
  const { user } = useAuth()
  const [showSalary, setShowSalary] = useState(false)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    if (user) {
      // Try to find a match in the static database or construct from jwt token
      const found = allEmployees.find(e => e.email.toLowerCase() === user.email?.toLowerCase())
      if (found) {
        setProfileData(found)
      } else {
        setProfileData({
          name: user.name || 'Employee User',
          role: user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'Employee',
          dept: 'Human Resources',
          email: user.email || 'employee@company.com',
          phone: '+966 50 000 0000',
          date: '2023-01-10',
          status: 'Active',
          salary: '$5,000',
          manager: 'HR Director',
          location: 'Riyadh',
          leaves: 20,
          attendance: '95%'
        })
      }
    }
  }, [user])

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar active="profile" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500">
            My Profile
          </div>
          <div className="w-9 h-9 bg-indigo-900 text-white flex items-center justify-center rounded-full font-bold shadow-sm uppercase">
            {user?.name?.[0] || user?.email?.[0] || 'A'}
          </div>
        </header>

        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative">
          <div className="h-32 bg-gradient-to-r from-indigo-950 via-slate-800 to-cyan-800"></div>
          <div className="p-6 pt-0 flex flex-col md:flex-row md:items-end gap-6 relative -top-10 -mb-6">
            <div className="w-24 h-24 bg-white p-1 rounded-2xl shadow-md">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-3xl font-extrabold rounded-xl uppercase">
                {profileData.name[0]}
              </div>
            </div>
            <div className="flex-1 md:pb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  profileData.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {profileData.status}
                </span>
              </div>
              <p className="text-gray-500 font-medium text-sm mt-1">{profileData.role} &bull; <span className="text-indigo-600">{profileData.dept}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Work Details & Contact */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-50 flex items-center gap-2">
                <User size={18} className="text-cyan-500" />
                <span>Professional Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Direct Manager</p>
                    <p className="text-sm font-semibold text-gray-700">{profileData.manager}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date Joined</p>
                    <p className="text-sm font-semibold text-gray-700">{profileData.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Office Location</p>
                    <p className="text-sm font-semibold text-gray-700">{profileData.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Department</p>
                    <p className="text-sm font-semibold text-gray-700">{profileData.dept}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-50 flex items-center gap-2">
                <Mail size={18} className="text-cyan-500" />
                <span>Contact & Communication</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Email Address</span>
                  <span className="text-sm font-medium text-gray-700">{profileData.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-50">
                  <span className="text-sm text-gray-400">Phone Number</span>
                  <span className="text-sm font-medium text-gray-700">{profileData.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Payroll */}
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-50">Performance Overview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Attendance Rate</p>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">{profileData.attendance}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-indigo-600 font-medium">Remaining Leaves</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">{profileData.leaves} Days</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center">
                    <CalendarDays size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Confidential / Payroll */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-50 flex items-center justify-between">
                <span>Payroll & Salary</span>
                <button
                  onClick={() => setShowSalary(!showSalary)}
                  className="text-gray-400 hover:text-indigo-600 transition"
                >
                  {showSalary ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Basic Salary (Monthly)</p>
                  <p className="text-2xl font-mono font-bold text-slate-800 mt-1">
                    {showSalary ? profileData.salary : '••••••'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
