import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, HelpCircle, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

function Sidebar({ active }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { id: 'employees', label: 'Employees', icon: <Users size={20} />, path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: <Calendar size={20} />, path: '/attendance' },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} />, path: '/reports' },
    { id: 'profile', label: 'My Profile', icon: <User size={20} />, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ]

  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col justify-between p-4 shadow-xl z-10 sticky top-0 h-screen">
      <div>
        <div className="text-center py-6 border-b border-gray-700 mb-6">
          <h1 className="text-xl font-bold tracking-wide">HR Management</h1>
          <h1 className="text-xl font-bold tracking-wide text-cyan-400 mt-1">System</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                active === item.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-700 pt-4 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <div className="flex justify-end text-gray-500 hover:text-gray-300 cursor-pointer">
          <HelpCircle size={20} />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
