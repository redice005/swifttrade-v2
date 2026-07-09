import NavBar from '@/components/NavBar'
import { useAiScanner } from '@/context/AiScannerContext'

export default function AiScanner() {
  const { scanning, result, cooldown, runScan } = useAiScanner()

  const logout = () => {
    localStorage.removeItem('deriv_token')
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡ Swift Trade</h1>
        <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
      <NavBar />

      {/* Scanner Panel */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>
          Demo feature - the market and digits below are chosen at random. This is not real market analysis.
        </p>

        <div
          style={{
            background: '#0a0a1a',
            borderRadius: '8px',
            padding: '2rem 1rem',
            marginTop: '1rem',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            textAlign: 'center',
          }}
        >
          {!scanning && !result && (
            <button
              onClick={runScan}
              style={{ padding: '1rem 2rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
            >
              Scan
            </button>
          )}

          {scanning && (
            <>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '4px solid #2e2e4d',
                  borderTopColor: '#6c63ff',
                  animation: 'ai-scanner-spin 0.9s linear infinite',
                }}
              />
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Scanning markets...</p>
            </>
          )}

          {!scanning && result && (
            <>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{result.market.label}</h2>
              <p style={{ margin: 0, fontSize: '1rem' }}>
                Direction: <strong style={{ color: '#6c63ff' }}>{result.direction}</strong>
              </p>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                First digit: <strong>{result.firstDigit}</strong>
              </p>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                Recovery digit: <strong>{result.recoveryDigit}</strong>
              </p>
              <button
                onClick={runScan}
                disabled={cooldown > 0}
                style={{ marginTop: '0.5rem', padding: '0.75rem 1.5rem', background: 'transparent', color: cooldown > 0 ? '#555' : '#fff', border: `1px solid ${cooldown > 0 ? '#333' : '#6c63ff'}`, borderRadius: '8px', cursor: cooldown > 0 ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                {cooldown > 0 ? `Scan Again in ${cooldown}s` : 'Scan Again'}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ai-scanner-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
