import NavBar from '@/components/NavBar'

export default function Bots() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡ Swift Trade</h1>
        <button onClick={() => { localStorage.removeItem('deriv_token'); window.location.href = '/login' }}
          style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          Logout</button>
      </div>

      <NavBar />

      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#6c63ff' }}>🤖 Bot Trading</h2>
        <p style={{ color: '#aaa' }}>Coming soon — automated trading bots</p>
      </div>
    </div>
  )
}