import { loginWithDeriv } from '@/lib/auth'

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#6c63ff', marginBottom: '0.5rem' }}>⚡ Swift Trade</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Elite execution platform</p>
        <button
          onClick={loginWithDeriv}
          style={{ width: '100%', padding: '1rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
        >
          Login
        </button>
        <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.8rem' }}>Don't have a Deriv account? Clicking above to sign up</p>
      </div>
    </div>
  )
}