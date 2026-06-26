import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { Users } from 'lucide-react'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [jobRole, setJobRole] = useState('Employee')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    let role = 'employee'
    if (jobRole === 'HR Manager') role = 'manager'
    if (jobRole === 'Admin') role = 'admin'

    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, jobRole, role })
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users size={28} color="white" />
          </div>
          <h1 className="text-xl font-bold text-[#1e293b]">HR Management System</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to get started</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition text-sm text-gray-700"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition shadow-sm mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-cyan-600 hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
