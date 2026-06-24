import React, { useState, useEffect } from 'react'
import { Shield, Search, Calendar, HardDrive, RefreshCw, Terminal, AlertCircle } from 'lucide-react'
import axios from 'axios'
import Sidebar from './components/Sidebar.jsx'
import { TableSkeleton } from './components/Skeleton.jsx'

function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLogs(response.data)
      setFilteredLogs(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch system audit logs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    const filtered = logs.filter(log =>
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress?.includes(searchTerm) ||
      log.performedByName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLogs(filtered)
  }, [searchTerm, logs])

  const getActionColor = (details) => {
    if (!details) return 'bg-slate-50 text-slate-700 border-slate-100'
    const lower = details.toLowerCase();
    if (lower.includes('create') || lower.includes('register')) return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (lower.includes('update') || lower.includes('edit')) return 'bg-blue-50 text-blue-700 border-blue-100'
    if (lower.includes('delete') || lower.includes('remove')) return 'bg-rose-50 text-rose-700 border-rose-100'
    return 'bg-slate-50 text-slate-700 border-slate-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar active="audit" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <Shield size={16} className="text-cyan-600" />
            <span>Security & Compliance</span>
          </div>
          <button
            onClick={fetchLogs}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition"
            title="Refresh Logs"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        {/* Page Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">System Audit Logs</h2>
            <p className="text-sm text-gray-500 mt-1">Track and monitor all administrative write actions across the system</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by action description, actor name, or IP address..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm text-gray-700 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Logs Timeline */}
        {loading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Terminal size={16} className="text-cyan-500" />
                <span>Live Action Feed</span>
              </span>
              <span className="text-xs text-gray-400 font-mono">Showing {filteredLogs.length} logs</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <div key={log._id} className="p-4 hover:bg-slate-50/50 transition flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800">{log.performedByName || 'Unknown User'}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive size={12} />
                          {log.ipAddress || '127.0.0.1'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getActionColor(log.details)}`}>
                        {log.details?.toLowerCase().includes('delete') ? 'DELETE' : log.details?.toLowerCase().includes('update') || log.details?.toLowerCase().includes('edit') ? 'UPDATE' : 'CREATE'}
                      </span>
                      <p className="text-sm text-gray-600 font-medium">{log.details || 'No details provided'}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No system logs found.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AuditLogsPage
