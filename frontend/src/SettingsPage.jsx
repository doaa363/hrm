import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, HelpCircle, User, Lock, Bell, Globe, Shield, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from './context/AuthContext.jsx'
import Sidebar from './components/Sidebar.jsx'

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('Password updated successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-200">{success}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <input type="password" placeholder="••••••••" required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
          value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input type="password" placeholder="••••••••" required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
          value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <input type="password" placeholder="••••••••" required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
          value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
      </div>
      <button type="submit" disabled={loading}
        className="px-5 py-2.5 bg-[#1e293b] hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition disabled:opacity-60">
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}

function SettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const currentView = user?.role === 'manager' || user?.role === 'admin' ? 'manager' : 'employee'
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', jobRole: '' })
  const [saved, setSaved] = useState(false)

  const [sysPrefs, setSysPrefs] = useState({ language: 'Arabic', timezone: 'UTC+2 (Cairo)', dateFormat: 'MM-DD-YYYY' })
  const [sysSaved, setSysSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || 'Employee User',
        email: user.email || 'employee@company.com',
        phone: user.phone || '+966 50 123 4567',
        jobRole: user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'Employee'
      })
    }
  }, [user])

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSysSave = (e) => {
    e.preventDefault()
    setSysSaved(true)
    setTimeout(() => setSysSaved(false), 2500)
  }

  const employeeTabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ]

  const managerTabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'system', label: 'System', icon: <Globe size={18} /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield size={18} /> },
  ]

  const tabs = currentView === 'manager' ? managerTabs : employeeTabs

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      <Sidebar active="settings" />

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
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account and system preferences</p>
        </div>

        <div className="flex gap-6">

          {/* Tabs */}
          <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-fit">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition mb-1 ${activeTab === tab.id ? 'bg-[#1e293b] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="flex items-center gap-2">{tab.icon}{tab.label}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSave}>
                <h3 className="text-base font-bold text-gray-800 mb-6">Profile Information</h3>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-indigo-900 text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                    {user?.name?.[0] || user?.email?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.jobRole}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={profile.jobRole} onChange={(e) => setProfile({ ...profile, jobRole: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button type="submit" className="px-5 py-2.5 bg-[#1e293b] hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition">Save Changes</button>
                  {saved && <span className="text-sm text-emerald-600 font-medium">✓ Saved successfully</span>}
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-6">Security Settings</h3>
                <ChangePassword />
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Leave Request Alerts', desc: 'Get notified when an employee submits a leave request' },
                    { label: 'Attendance Alerts', desc: 'Get notified when an employee is absent or late' },
                    { label: 'Monthly Report Ready', desc: 'Get notified when monthly reports are generated' },
                    { label: 'New Employee Added', desc: 'Get notified when a new employee joins the system' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-checked:bg-cyan-500 rounded-full transition peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-6">System Preferences</h3>
                <form onSubmit={handleSysSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={sysPrefs.language}
                      onChange={(e) => setSysPrefs({ ...sysPrefs, language: e.target.value })}
                    >
                      <option>English</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={sysPrefs.timezone}
                      onChange={(e) => setSysPrefs({ ...sysPrefs, timezone: e.target.value })}
                    >
                      <option>UTC+3 (Riyadh)</option>
                      <option>UTC+2 (Cairo)</option>
                      <option>UTC+0 (London)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={sysPrefs.dateFormat}
                      onChange={(e) => setSysPrefs({ ...sysPrefs, dateFormat: e.target.value })}
                    >
                      <option>DD-MM-YYYY</option>
                      <option>MM-DD-YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button type="submit" className="px-5 py-2.5 bg-[#1e293b] hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition">Save Preferences</button>
                    {sysSaved && <span className="text-sm text-emerald-600 font-medium">✓ Saved successfully</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-6">Roles & Permissions</h3>
                <div className="space-y-3">
                  {[
                    { role: 'Admin', perms: ['View Dashboard', 'Manage Employees', 'Approve Leaves', 'View Reports', 'System Settings'] },
                    { role: 'HR Manager', perms: ['View Dashboard', 'Manage Employees', 'Approve Leaves', 'View Reports'] },
                    { role: 'Employee', perms: ['View Dashboard', 'View Own Attendance', 'Submit Leave Request'] },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-800 mb-2">{item.role}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.perms.map((p, j) => (
                          <span key={j} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">{p}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
