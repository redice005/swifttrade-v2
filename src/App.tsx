// v2 routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DerivProvider } from '@/context/DerivContext'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Callback from '@/pages/Callback'
import Bots from '@/pages/Bots'
import Analysis from '@/pages/Analysis'
import { useState, useEffect } from 'react'

function ProtectedRoutes() {
  const token = localStorage.getItem('deriv_token')
  if (!token) return <Navigate to="/login" />

  return (
    <DerivProvider>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bots" element={<Bots />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </DerivProvider>
  )
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('deriv_token'))

  useEffect(() => {
    // Listen for token changes across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'deriv_token') {
        setToken(e.newValue)
      }
    }

    // Also poll every second in case storage event doesn't fire
    const interval = setInterval(() => {
      const current = localStorage.getItem('deriv_token')
      setToken(prev => prev !== current ? current : prev)
    }, 1000)

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App