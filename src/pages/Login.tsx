import { loginWithDeriv } from '@/lib/auth'

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#6c63ff', marginBottom: '0.5rem' }}>⚡ Swift Trade</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Professional trading platform for Kenyan traders</p>
        
        <button
          onClick={loginWithDeriv}
          style={{ width: '100%', padding: '1rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}
        >
          Login with Deriv
        </button>

        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Don't have a Deriv account?</p>
          <button
            onClick={() => window.open('https://partner-tracking.deriv.com/click?a=18029&o=1&c=3&link_id=1', '_blank')}
            style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
          >
            Create Deriv Account
          </button>
          <p style={{ color: '#555', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Free to sign up · Start with demo account</p>
        </div>
      </div>
    </div>
  )
}