import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const storedState = sessionStorage.getItem('oauth_state')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    if (!code || state !== storedState) {
      navigate('/login')
      return
    }

    // Store code and verifier for token exchange
    sessionStorage.setItem('auth_code', code)
    sessionStorage.setItem('code_verifier', codeVerifier || '')

    // Clear state
    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('pkce_code_verifier')

    // For now store code directly and redirect to dashboard
    localStorage.setItem('deriv_auth_code', code)
    navigate('/dashboard')
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#fff' }}>Authenticating...</p>
    </div>
  )
}