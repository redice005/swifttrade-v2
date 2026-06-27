import { useState, useEffect, useRef } from 'react'
import NavBar from '@/components/NavBar'
import { useDeriv } from '@/context/DerivContext'

export default function Analysis() {
  const [market, setMarket] = useState('R_100')
  const [digits, setDigits] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('digits_R_100')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [lastDigit, setLastDigit] = useState<number | null>(null)
  const [tickCount, setTickCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tickCount_R_100')
      return saved ? parseInt(saved) : 0
    } catch { return 0 }
  })
  const [pulse, setPulse] = useState(false)
  const [viewWindow, setViewWindow] = useState<10 | 20 | 50 | 100 | 500>(50)

  const { status, send, subscribe } = useDeriv()
  const currentMarketRef = useRef(market)

  useEffect(() => {
    if (digits.length === 0) return
    localStorage.setItem(`digits_${market}`, JSON.stringify(digits))
    localStorage.setItem(`tickCount_${market}`, tickCount.toString())
  }, [digits, tickCount, market])

  useEffect(() => {
    if (status !== 'open') return

    try {
      const saved = localStorage.getItem(`digits_${market}`)
      const savedCount = localStorage.getItem(`tickCount_${market}`)
      setDigits(saved ? JSON.parse(saved) : [])
      setTickCount(savedCount ? parseInt(savedCount) : 0)
    } catch {
      setDigits([])
      setTickCount(0)
    }

    setLastDigit(null)
    currentMarketRef.current = market

    const unsub = subscribe((data) => {
      if (data.msg_type === 'tick') {
        const price = data.tick.quote
        const digit = parseInt(price.toString().slice(-1))
        setLastDigit(digit)
        setPulse(true)
        setTimeout(() => setPulse(false), 600)
        setDigits(prev => {
          const updated = [...prev, digit]
          return updated.slice(-500)
        })
        setTickCount(prev => prev + 1)
      }
    })

    send({ ticks: market, subscribe: 1 })

    return () => { unsub() }
  }, [status, market])

  const resetAnalysis = () => {
    localStorage.removeItem(`digits_${market}`)
    localStorage.removeItem(`tickCount_${market}`)
    setDigits([])
    setTickCount(0)
    setLastDigit(null)
  }

  const visibleDigits = digits.slice(-viewWindow)

  const getPercentages = () => {
    if (visibleDigits.length === 0) return Array(10).fill(0)
    return Array.from({ length: 10 }, (_, i) => {
      const count = visibleDigits.filter(d => d === i).length
      return parseFloat(((count / visibleDigits.length) * 100).toFixed(1))
    })
  }

  const getStreak = () => {
    if (digits.length < 2) return null
    const last = digits[digits.length - 1]
    let count = 1
    for (let i = digits.length - 2; i >= 0; i--) {
      if (digits[i] === last) count++
      else break
    }
    return count >= 2 ? { digit: last, count } : null
  }

  const percentages = getPercentages()
  const hasEnoughData = visibleDigits.length >= viewWindow
  const maxPct = Math.max(...percentages)
  const minPct = Math.min(...percentages)
  const streak = getStreak()

  const logout = () => {
    localStorage.removeItem('deriv_token')
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.7); }
          70% { box-shadow: 0 0 0 18px rgba(108, 99, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0); }
        }
        .last-digit-pulse {
          animation: pulse-ring 0.6s ease-out;
        }
        .window-btn {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          border: 1px solid #333;
          background: transparent;
          color: #aaa;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .window-btn.active {
          background: #6c63ff;
          border-color: #6c63ff;
          color: #fff;
          font-weight: bold;
        }
        .digit-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: bold;
          color: #fff;
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          margin: 0 auto;
          flex-shrink: 0;
        }
        .digit-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          width: 100%;
        }
        .digit-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .digit-label {
          font-size: 0.72rem;
          font-weight: bold;
          transition: color 0.3s ease;
        }
        .reset-btn {
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          border: 1px solid #ef4444;
          background: transparent;
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-btn:hover {
          background: #ef4444;
          color: #fff;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡ Swift Trade</h1>
        <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>

      <NavBar />

      {/* Market Selector */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <p style={{ color: '#aaa', margin: 0, fontSize: '0.8rem' }}>Select Market</p>
          <button className="reset-btn" onClick={resetAnalysis}>↺ Reset</button>
        </div>
        <select value={market} onChange={e => setMarket(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px' }}>
          <optgroup label="Volatility Indices">
            <option value="R_10">Volatility 10</option>
            <option value="R_25">Volatility 25</option>
            <option value="R_50">Volatility 50</option>
            <option value="R_75">Volatility 75</option>
            <option value="R_100">Volatility 100</option>
            <option value="R_150">Volatility 150</option>
            <option value="R_200">Volatility 200</option>
          </optgroup>
          <optgroup label="Volatility Indices (1s)">
            <option value="1HZ10V">Volatility 10 (1s)</option>
            <option value="1HZ15V">Volatility 15 (1s)</option>
            <option value="1HZ25V">Volatility 25 (1s)</option>
            <option value="1HZ30V">Volatility 30 (1s)</option>
            <option value="1HZ50V">Volatility 50 (1s)</option>
            <option value="1HZ75V">Volatility 75 (1s)</option>
            <option value="1HZ100V">Volatility 100 (1s)</option>
            <option value="1HZ150V">Volatility 150 (1s)</option>
            <option value="1HZ200V">Volatility 200 (1s)</option>
          </optgroup>
        </select>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
            {status === 'open' ? '🟢 Live' : '🔴 Connecting...'}
          </span>
        </div>
      </div>

      {/* Tick Window Selector */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 0.75rem', fontSize: '0.8rem' }}>ANALYSE LAST</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {([10, 20, 50, 100, 500] as const).map(n => (
            <button
              key={n}
              className={`window-btn ${viewWindow === n ? 'active' : ''}`}
              onClick={() => setViewWindow(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Last Digit — compact */}
      {lastDigit !== null && (
        <div style={{
          background: '#1a1a2e',
          borderRadius: '12px',
          padding: '0.75rem 1.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ color: '#aaa', margin: '0 0 0.2rem', fontSize: '0.75rem' }}>LAST DIGIT</p>
            {streak && (
              <p style={{ color: '#f59e0b', margin: 0, fontSize: '0.75rem' }}>
                🔥 Digit {streak.digit} appeared {streak.count}x in a row
              </p>
            )}
          </div>
          <div
            className={pulse ? 'last-digit-pulse' : ''}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#6c63ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              boxShadow: '0 0 20px rgba(108, 99, 255, 0.5)',
              flexShrink: 0
            }}>
            {lastDigit}
          </div>
        </div>
      )}

      {/* Digit Circles — fixed size, no bulge */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 1rem', fontSize: '0.8rem' }}>
          DIGIT DISTRIBUTION (last {visibleDigits.length} ticks)
        </p>
        <div className="digit-grid">
          {Array.from({ length: 10 }, (_, i) => {
            const pct = percentages[i]
            const isHot = hasEnoughData && pct === maxPct
            const isCold = hasEnoughData && pct === minPct
            const isLast = lastDigit === i

            let bgColor = '#1e1e3a'
            if (isLast) bgColor = '#6c63ff'
            else if (isHot) bgColor = '#22c55e'
            else if (isCold) bgColor = '#ef4444'

            let textColor = '#aaa'
            if (isLast) textColor = '#6c63ff'
            else if (isHot) textColor = '#22c55e'
            else if (isCold) textColor = '#ef4444'

            return (
              <div key={i} className="digit-cell">
                <div
                  className="digit-circle"
                  style={{
                    background: bgColor,
                    border: isLast ? '3px solid #fff' : '2px solid #333',
                    boxShadow: isLast ? '0 0 15px rgba(108, 99, 255, 0.7)' : 'none',
                  }}
                >
                  {i}
                </div>
                <span className="digit-label" style={{ color: textColor }}>
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 1rem', fontSize: '0.8rem' }}>DIGIT BARS</p>
        {Array.from({ length: 10 }, (_, i) => {
          const pct = percentages[i]
          const isHot = hasEnoughData && pct === maxPct
          const isCold = hasEnoughData && pct === minPct
          const isLast = lastDigit === i

          let barColor = '#3d3d5c'
          if (isLast) barColor = '#6c63ff'
          else if (isHot) barColor = '#22c55e'
          else if (isCold) barColor = '#ef4444'

          let labelColor = '#aaa'
          if (isLast) labelColor = '#6c63ff'
          else if (isHot) labelColor = '#22c55e'
          else if (isCold) labelColor = '#ef4444'

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#fff', width: '20px', fontSize: '0.85rem', fontWeight: isLast ? 'bold' : 'normal' }}>{i}</span>
              <div style={{ flex: 1, background: '#0a0a1a', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: barColor,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ color: labelColor, width: '45px', fontSize: '0.8rem', fontWeight: 'bold' }}>{pct}%</span>
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>🟢 Most frequent</span>
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>🔴 Least frequent</span>
          <span style={{ color: '#6c63ff', fontSize: '0.75rem' }}>🟣 Last digit</span>
        </div>
      </div>
    </div>
  )
}