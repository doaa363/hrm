import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, Search, Plus, Trash2, Edit2, HelpCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { TableSkeleton } from './components/Skeleton.jsx'
import socket from './utils/socket.js'
import Sidebar from './components/Sidebar.jsx'

function Employees() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const currentView = user?.role === 'manager' || user?.role === 'admin' ? 'manager' : 'employee'
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newEmp, setNewEmp] = useState({ name: '', role: '', dept: 'Information Technology', email: '', phone: '', date: '', status: 'Active' })

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleAddEmployee = (e) => {
    e.preventDefault()
    setEmployees([...employees, { ...newEmp, id: Date.now() }])
    setNewEmp({ name: '', role: '', dept: 'Information Technology', email: '', phone: '', date: '', status: 'Active' })
    setShowModal(false)
  }

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ahmed Mohamed Ali', role: 'Software Development Manager', dept: 'Information Technology', email: 'ahmed.m@company.com', phone: '+966 50 123 4567', date: '2020-03-15', status: 'Active' },
    { id: 2, name: 'Fatima Ahmed Hassan', role: 'UI/UX Designer', dept: 'Design', email: 'fatima.a@company.com', phone: '+966 55 234 5678', date: '2021-06-20', status: 'Active' },
    { id: 3, name: 'Mahmoud Hassan Ibrahim', role: 'Data Analyst', dept: 'Information Technology', email: 'mahmoud.h@company.com', phone: '+966 50 345 6789', date: '2019-11-10', status: 'On Leave' },
    { id: 4, name: 'Sara Khalid Mohamed', role: 'HR Manager', dept: 'Human Resources', email: 'sara.k@company.com', phone: '+966 55 456 7890', date: '2018-01-05', status: 'Active' },
    { id: 5, name: 'Omar Abdullah Saeed', role: 'Frontend Developer', dept: 'Information Technology', email: 'omar.a@company.com', phone: '+966 50 567 8901', date: '2022-08-12', status: 'Active' },
    { id: 6, name: 'Laila Mohamed Ahmed', role: 'Sales Manager', dept: 'Sales', email: 'laila.m@company.com', phone: '+966 55 678 9012', date: '2021-02-28', status: 'Active' },
  ])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id))
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = selectedDepartment === 'All Departments' || emp.dept === selectedDepartment
    return matchesSearch && matchesDept
  })

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      <Sidebar active="employees" />

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage employee data</p>
          </div>
          {currentView === 'manager' && (
            <button onClick={() => setShowModal(true)} className="bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition">
              <Plus size={18} />
              <span>Add New Employee</span>
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, role, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm text-gray-700 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-4 py-2 outline-none text-sm text-gray-700 bg-white min-w-[180px]"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="All Departments">All Departments</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Design">Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Employees Table */}
        {loading ? (
          <TableSkeleton rows={8} cols={currentView === 'manager' ? 6 : 5} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-medium text-sm border-b border-gray-100">
                  <th className="p-4 text-left pl-6">Employee</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Contact Info</th>
                  <th className="p-4 text-left">Join Date</th>
                  <th className="p-4 text-left">Status</th>
                  {currentView === 'manager' && <th className="p-4 text-center pr-6">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-base">
                          {emp.name[0]}
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-800">{emp.name}</h5>
                          <p className="text-xs text-gray-400 mt-0.5">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{emp.dept}</td>
                    <td className="p-4">
                      <p className="text-gray-600 text-xs">{emp.email}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{emp.phone}</p>
                    </td>
                    <td className="p-4 text-gray-500">{emp.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    {currentView === 'manager' && (
                      <td className="p-4 pr-6">
                        <div className="flex justify-center gap-2 text-gray-400">
                          <button onClick={(e) => e.stopPropagation()} className="p-1.5 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(emp.id) }} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No employees found matching your search.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Add New Employee</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" required placeholder="John Doe"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                  <input type="text" required placeholder="e.g. Developer"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEmp.role} onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" placeholder="+966 50 000 0000"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEmp.phone} onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEmp.dept} onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}>
                    <option>Information Technology</option>
                    <option>Design</option>
                    <option>Human Resources</option>
                    <option>Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input type="date" required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEmp.date} onChange={(e) => setNewEmp({ ...newEmp, date: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 text-sm text-white bg-indigo-900 hover:bg-indigo-950 rounded-lg transition">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
