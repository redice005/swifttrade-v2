import { useState, useEffect, useRef } from 'react'

// Market pool: V10, V25, V75, V100 and their 1s variants
const MARKETS = [
  { code: 'R_10', label: 'Volatility 10 Index' },
  { code: 'R_25', label: 'Volatility 25 Index' },
  { code: 'R_75', label: 'Volatility 75 Index' },
  { code: 'R_100', label: 'Volatility 100 Index' },
  { code: '1HZ10V', label: 'Volatility 10 (1s) Index' },
  { code: '1HZ25V', label: 'Volatility 25 (1s) Index' },
  { code: '1HZ75V', label: 'Volatility 75 (1s) Index' },
  { code: '1HZ100V', label: 'Volatility 100 (1s) Index' },
]

type Direction = 'Over' | 'Under'

interface Recommendation {
  market: { code: string; label: string }
  direction: Direction
  firstDigit: number
  recoveryDigit: number
}

// Fixed digit pairs - not derived from real analysis, just a placeholder
// rule for demoing the UI flow.
const DIRECTION_RULES: Record<Direction, { first: number; recovery: number }> = {
  Over: { first: 1, recovery: 3 },
  Under: { first: 8, recovery: 6 },
}

function pickRandomRecommendation(): Recommendation {
  const market = MARKETS[Math.floor(Math.random() * MARKETS.length)]
  const direction: Direction = Math.random() < 0.5 ? 'Over' : 'Under'
  const rule = DIRECTION_RULES[direction]
  return {
    market,
    direction,
    firstDigit: rule.first,
    recoveryDigit: rule.recovery,
  }
}

const CYCLE_SECONDS = 30
const SCAN_DURATION_MS = 2200

export default function AiScanner() {
  const [scanning, setScanning] = useState(true)
  const [result, setResult] = useState<Recommendation | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(CYCLE_SECONDS)
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runScan = () => {
    setResult(null)
    setScanning(true)
    setSecondsLeft(CYCLE_SECONDS)

    scanTimeout.current = setTimeout(() => {
      setResult(pickRandomRecommendation())
      setScanning(false)
    }, SCAN_DURATION_MS)
  }

  // Run once on mount
  useEffect(() => {
    runScan()
    return () => {
      if (scanTimeout.current) clearTimeout(scanTimeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown + auto re-scan every 30s
  useEffect(() => {
    if (scanning) return

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          runScan()
          return CYCLE_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning])

  return (
    <div style={{ padding: '1rem', color: '#fff' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>AI Scanner</h1>
      <p style={{ color: '#9a9ab0', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Trade responsibly.
      </p>

      <div
        style={{
          background: '#1a1a2e',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
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
            <p style={{ color: '#9a9ab0', fontSize: '0.9rem' }}>Scanning markets...</p>
          </>
        )}

        {!scanning && result && (
          <>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{result.market.label}</h2>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              Direction:{' '}
              <strong style={{ color: '#6c63ff' }}>{result.direction}</strong>
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              First digit: <strong>{result.firstDigit}</strong>
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Recovery digit: <strong>{result.recoveryDigit}</strong>
            </p>
            <p style={{ color: '#9a9ab0', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Next scan in {secondsLeft}s
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes ai-scanner-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
