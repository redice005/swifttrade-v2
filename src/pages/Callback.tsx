import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DERIV_CLIENT_ID, REDIRECT_URI } from '@/lib/auth'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier') || localStorage.getItem('pkce_code_verifier')

    if (!code) {
      navigate('/login')
      return
    }

    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('pkce_code_verifier')
    localStorage.removeItem('pkce_code_verifier')

    fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, codeVerifier, redirectUri: REDIRECT_URI, clientId: DERIV_CLIENT_ID })
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('deriv_token', data.access_token)
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#fff' }}>Swifttrade Loading...</p>
    </div>
  )
}
