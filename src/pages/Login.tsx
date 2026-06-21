import { loginWithDeriv } from '@/lib/auth'

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated background lines */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${i * 18}%`,
            top: 0,
            width: '1px',
            height: '100%',
            background: 'linear-gradient(to bottom, transparent, rgba(108, 99, 255, 0.15), transparent)',
          }} />
        ))}
        {/* Glowing orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(108, 99, 255, 0.08)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.06)', filter: 'blur(80px)' }} />
      </div>

      {/* Fake chart lines top */}
      <div style={{ position: 'absolute', top: '5%', left: 0, right: 0, zIndex: 0, opacity: 0.15 }}>
        <svg viewBox="0 0 400 80" style={{ width: '100%' }}>
          <polyline points="0,60 40,45 80,55 120,30 160,40 200,20 240,35 280,15 320,25 360,10 400,20" fill="none" stroke="#6c63ff" strokeWidth="2" />
          <polyline points="0,70 40,65 80,70 120,50 160,60 200,45 240,55 280,40 320,50 360,35 400,45" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Live ticker bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(108, 99, 255, 0.1)', borderBottom: '1px solid rgba(108, 99, 255, 0.2)', padding: '0.4rem 1rem', display: 'flex', gap: '2rem', overflowX: 'hidden', zIndex: 1 }}>
        {['V100 ▲ 346.61', 'V75 ▲ 521.23', 'V50 ▼ 1204.55', 'V25 ▲ 842.10', 'V10 ▼ 2341.89', 'V100(1s) ▲ 346.81'].map((tick, i) => (
          <span key={i} style={{ color: tick.includes('▲') ? '#22c55e' : '#ef4444', fontSize: '0.75rem', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{tick}</span>
        ))}
      </div>

      {/* Main card */}
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(26, 26, 46, 0.95)', backdropFilter: 'blur(20px)', padding: '2.5rem 2rem', borderRadius: '16px', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid rgba(108, 99, 255, 0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Logo */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>⚡</span>
        </div>
        <h1 style={{ color: '#fff', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 'bold' }}>
          Swift <span style={{ color: '#6c63ff' }}>Trade</span>
        </h1>
        <p style={{ color: '#aaa', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Elite execution platform</p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['📈 Manual Trading', ' Smart Bots', ' Live Analysis'].map((f, i) => (
            <span key={i} style={{ background: 'rgba(108, 99, 255, 0.15)', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.7rem', color: '#aaa' }}>{f}</span>
          ))}
        </div>

        <button
          onClick={loginWithDeriv}
          style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', boxShadow: '0 4px 15px rgba(108, 99, 255, 0.4)' }}
        >
          Login
        </button>

        <div style={{ border: '1px solid #222', borderRadius: '10px', padding: '1rem' }}>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Don't have a Deriv account?</p>
          <button
            onClick={() => window.open('https://partner-tracking.deriv.com/click?a=18029&o=1&c=3&link_id=1', '_blank')}
            style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
          >
            Create Free Account
          </button>
          <p style={{ color: '#555', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Free sign up · Start with demo account</p>
        </div>

        {/* Bottom trust line */}
        <p style={{ color: '#333', fontSize: '0.7rem', marginTop: '1.5rem' }}>Powered by Deriv · Secure OAuth2 Login</p>
      </div>

      {/* Fake chart lines bottom */}
      <div style={{ position: 'absolute', bottom: '5%', left: 0, right: 0, zIndex: 0, opacity: 0.15 }}>
        <svg viewBox="0 0 400 80" style={{ width: '100%' }}>
          <polyline points="0,40 40,55 80,35 120,50 160,30 200,45 240,25 280,40 320,20 360,35 400,15" fill="none" stroke="#6c63ff" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}
