import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setError('Check your email for confirmation!')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>Swift Trade</h1>
        {error && <p style={{ color: error.includes('Check') ? 'green' : 'red', marginBottom: '1rem' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: 'none', background: '#0a0a1a', color: '#fff', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: 'none', background: '#0a0a1a', color: '#fff', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.5rem' }}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer' }}
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}