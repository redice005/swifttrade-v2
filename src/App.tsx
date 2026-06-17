// v2 routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DerivProvider } from '@/context/DerivContext'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Callback from '@/pages/Callback'
import Bots from '@/pages/Bots'
import Analysis from '@/pages/Analysis'

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
  const token = localStorage.getItem('deriv_token')

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