import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, HelpCircle, User, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSidebar } from '../context/SidebarContext.jsx'
import CommandPalette from './CommandPalette.jsx'

function Sidebar({ active }) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { collapsed, setCollapsed } = useSidebar()
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

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
    ...(user?.role === 'manager' || user?.role === 'admin' ? [
      { id: 'audit', label: 'Audit Logs', icon: <Shield size={20} />, path: '/audit-logs' }
    ] : []),
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ]

  return (
    <>
      {/* Hamburger button — visible only when collapsed */}
      <button
        onClick={() => setCollapsed(false)}
        className={`fixed top-4 left-4 z-50 w-9 h-9 bg-[#1e293b] text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-700 transition-all duration-300 ${collapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        title="Open Sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#1e293b] text-white flex flex-col justify-between p-4 shadow-xl z-40 overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'w-0 p-0 opacity-0' : 'w-64 opacity-100'}`}
      >
        <div>
          <div className="py-6 border-b border-gray-700 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-wide whitespace-nowrap">HR Management</h1>
              <h1 className="text-xl font-bold tracking-wide text-cyan-400 mt-1 whitespace-nowrap">System</h1>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg p-1.5 transition flex-shrink-0"
              title="Collapse Sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${
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

        <div className="border-t border-gray-700 pt-4 space-y-3">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-gray-400 transition whitespace-nowrap"
          >
            <span className="flex items-center gap-1.5 font-medium text-cyan-400">
              <span className="animate-pulse">✨</span> Magic Console
            </span>
            <span className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-600">Ctrl+K</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition whitespace-nowrap"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <div className="flex justify-end text-gray-500 hover:text-gray-300 cursor-pointer">
            <HelpCircle size={20} />
          </div>
        </div>

        <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      </aside>
    </>
  )
}

export default Sidebar
