import React, { useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useAuth } from './context/AuthContext.jsx'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { login, user } = useAuth()

  if (user) return <Navigate to="/dashboard" replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      login(response.data.token)
      setMessage('Login Successful! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex w-1/2 bg-[#1e293b] flex-col items-center justify-center p-12 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-3">HR Management System</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Manage your workforce efficiently. Track attendance, handle leave requests, and generate reports all in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-2xl font-bold text-cyan-400">150+</p>
              <p className="text-xs text-gray-400 mt-1">Employees</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-2xl font-bold text-cyan-400">94%</p>
              <p className="text-xs text-gray-400 mt-1">Attendance</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-2xl font-bold text-cyan-400">24</p>
              <p className="text-xs text-gray-400 mt-1">Reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to access your dashboard</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
          {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200">{message}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition shadow-sm mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-600 hover:underline font-medium">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
