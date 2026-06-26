import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = () => {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
