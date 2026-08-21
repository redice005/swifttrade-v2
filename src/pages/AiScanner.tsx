import NavBar from '@/components/NavBar'
import { useAiScanner } from '@/context/AiScannerContext'

export default function AiScanner() {
  const { scanning, result, cooldown, runScan } = useAiScanner()

  const logout = () => {
    localStorage.removeItem('deriv_token')
    window.location.href = '/login'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a1a',
        color: '#fff',
        padding: '1rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ color: '#6c63ff', margin: 0 fontSize:'1.4rem', fontWeight:600}}>⚡ Swift Trade</h1>

        <button
          onClick={logout}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #333',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <NavBar />

      {/* Scanner Panel */}
      <div
        style={{
          background: '#1a1a2e',
          borderRadius: '14px',
          padding: '1.5rem',
          border: '1px solid #252542',
        }}
      >
        {/* Scanner Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  color: '#fff',
                }}
              >
                ⚡ AI Market Scanner
              </h2>

              <p
                style={{
                  color: '#888',
                  margin: '0.4rem 0 0',
                  fontSize: '0.85rem',
                }}
              >
                Analyze available markets and detect the current setup.
              </p>
            </div>

            {/* Bot to be Used */}
            <div
              style={{
                background: '#0f0f24',
                border: '1px solid #302d5c',
                borderRadius: '10px',
                padding: '0.7rem 1rem',
                minWidth: '170px',
              }}
            >
              <div
                style={{
                  color: '#777',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                Bot to be Used
              </div>

              <div
                style={{
                  color: '#6c63ff',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                }}
              >
                Market Switcher
              </div>
            </div>
          </div>
        </div>

        <p
          style={{
            color: '#aaa',
            margin: '0 0 0.25rem',
            fontSize: '0.8rem',
          }}
        >
          Trade responsibly.
        </p>

        {/* Scanner Area */}
        <div
          style={{
            background: '#0a0a1a',
            borderRadius: '12px',
            padding: '2.25rem 1rem',
            marginTop: '1rem',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            textAlign: 'center',
            border: '1px solid #20203a',
          }}
        >
          {!scanning && !result && (
            <>
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: '#17172d',
                  border: '1px solid #302d5c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '0.25rem',
                }}
              >
                ⚡
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                }}
              >
                Ready to Scan
              </h3>

              <p
                style={{
                  color: '#777',
                  margin: 0,
                  fontSize: '0.82rem',
                  maxWidth: '330px',
                }}
              >
                Run the scanner to identify the current market setup.
              </p>

              <button
                onClick={runScan}
                style={{
                  marginTop: '0.4rem',
                  padding: '0.9rem 2rem',
                  background: '#6c63ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 6px 20px rgba(108, 99, 255, 0.2)',
                }}
              >
                ⚡ Run Market Scan
              </button>
            </>
          )}

          {scanning && (
            <>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '4px solid #2e2e4d',
                  borderTopColor: '#6c63ff',
                  animation: 'ai-scanner-spin 0.9s linear infinite',
                }}
              />

              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                }}
              >
                Analyzing Markets
              </h3>

              <p
                style={{
                  color: '#aaa',
                  fontSize: '0.85rem',
                  margin: 0,
                }}
              >
                Scanning markets...
              </p>
            </>
          )}

          {!scanning && result && (
            <>
              {/* Result Status */}
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#6c63ff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                }}
              >
                Signal Detected
              </div>

              <h2
                style={{
                  margin: '0.15rem 0 0.25rem',
                  fontSize: '1.25rem',
                }}
              >
                {result.market.label}
              </h2>

              {/* Direction */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  background: '#111125',
                  border: '1px solid #252542',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginTop: '0.25rem',
                }}
              >
                <div
                  style={{
                    color: '#777',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Direction
                </div>

                <div
                  style={{
                    color: '#6c63ff',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginTop: '0.25rem',
                  }}
                >
                  {result.direction}
                </div>
              </div>

              {/* Digits */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    background: '#111125',
                    border: '1px solid #252542',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      color: '#777',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    First Digit
                  </div>

                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      marginTop: '0.2rem',
                    }}
                  >
                    {result.firstDigit}
                  </div>
                </div>

                <div
                  style={{
                    background: '#111125',
                    border: '1px solid #252542',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      color: '#777',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recovery Digit
                  </div>

                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      marginTop: '0.2rem',
                    }}
                  >
                    {result.recoveryDigit}
                  </div>
                </div>
              </div>

              <button
                onClick={runScan}
                disabled={cooldown > 0}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: cooldown > 0 ? '#555' : '#fff',
                  border: `1px solid ${
                    cooldown > 0 ? '#333' : '#6c63ff'
                  }`,
                  borderRadius: '8px',
                  cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                {cooldown > 0
                  ? `Scan Again in ${cooldown}s`
                  : 'Scan Again'}
              </button>
            </>
          )}
        </div>

        {/* Information */}
        <div
          style={{
            marginTop: '1rem',
            background: '#111125',
            border: '1px solid #252542',
            borderRadius: '10px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              color: '#6c63ff',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.35rem',
            }}
          >
            How the bots operate
          </div>

          <p
            style={{
              color: '#aaa',
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            The bots work under a trained model and identifies its own entry
            point.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ai-scanner-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}