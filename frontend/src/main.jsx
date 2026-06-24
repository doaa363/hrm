import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import App from './App.jsx'
import Register from './Register.jsx'
import Dashboard from './Dashboard.jsx'
import Employees from './Employees.jsx'
import Attendance from './Attendance.jsx'
import SettingsPage from './SettingsPage.jsx'
import Reports from './Reports.jsx'
import EmployeeDetail from './EmployeeDetail.jsx'
import ProfilePage from './ProfilePage.jsx'
import AuditLogsPage from './AuditLogsPage.jsx'
import Chatbot from './components/Chatbot.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>

        {/* Floating AI Chatbot — visible on every page */}
        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
