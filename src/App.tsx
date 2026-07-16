// v2 routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DerivProvider } from '@/context/DerivContext'
import { AiScannerProvider } from '@/context/AiScannerContext'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Callback from '@/pages/Callback'
import Bots from '@/pages/Bots'
import Analysis from '@/pages/Analysis'
import AiScanner from '@/pages/AiScanner'
import Funded from '@/pages/Funded'
import { useState, useEffect } from 'react'

function ProtectedRoutes() {
  const token = localStorage.getItem('deriv_token')
  if (!token) return <Navigate to="/login" />

  return (
    <DerivProvider>
      <AiScannerProvider>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/ai-scanner" element={<AiScanner />} />
          <Route path="/funded" element={<Funded />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AiScannerProvider>
    </DerivProvider>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('deriv_token'))

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'deriv_token') setToken(e.newValue)
    }
    const interval = setInterval(() => {
      const current = localStorage.getItem('deriv_token')
      setToken(prev => prev !== current ? current : prev)
    }, 500)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App