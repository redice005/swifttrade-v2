import { useState, useEffect, useRef } from 'react'
import NavBar from '@/components/NavBar'
import { useDerivSocket } from '@/hooks/useDerivSocket'
import { getDerivAccounts, getDerivWebSocketUrl } from '@/lib/deriv'

export default function Analysis() {
  const [accountType] = useState<'demo' | 'real'>('demo')
  const [wsUrl, setWsUrl] = useState<string | null>(null)
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

  const { status, send, subscribe } = useDerivSocket(wsUrl)
  const token = localStorage.getItem('deriv_token')
  const currentMarketRef = useRef(market)

  useEffect(() => {
    if (!token) return
    const connect = async () => {
      const accs = await getDerivAccounts(token)
      if (!accs || accs.length === 0) return
      const acc = accs.find((a: any) => a.account_type === accountType) || accs[0]
      const url = await getDerivWebSocketUrl(acc.account_id, token, accountType)
      setWsUrl(url)
    }
    connect()
    const interval = setInterval(connect, 50000)
    return () => clearInterval(interval)
  }, [token])

  // Save digits + tickCount to localStorage whenever they change
  useEffect(() => {
    if (digits.length === 0) return
    localStorage.setItem(`digits_${market}`, JSON.stringify(digits))
    localStorage.setItem(`tickCount_${market}`, tickCount.toString())
  }, [digits, tickCount, market])

  useEffect(() => {
    if (status !== 'open') return

    // Load saved data for this market
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

  const getPercentages = () => {
    if (digits.length === 0) return Array(10).fill(0)
    return Array.from({ length: 10 }, (_, i) => {
      const count = digits.filter(d => d === i).length
      return parseFloat(((count / digits.length) * 100).toFixed(1))
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
  const hasEnoughData = digits.length >= 50
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
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡ Swift Trade</h1>
        <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>

      <NavBar />

      {/* Market Selector */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Select Market</p>
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
          <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
            {tickCount} ticks
          </span>
        </div>

        {!hasEnoughData && tickCount > 0 && (
          <div style={{
            marginTop: '0.5rem',
            background: '#2a2a1a',
            border: '1px solid #554400',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            color: '#f59e0b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⏳ Collecting data for accurate stats</span>
            <span style={{ fontWeight: 'bold' }}>{tickCount}/50</span>
          </div>
        )}
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

      {/* Digit Circles */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 1rem', fontSize: '0.8rem' }}>DIGIT DISTRIBUTION (last {digits.length} ticks)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', width: '100%' }}>
          {Array.from({ length: 10 }, (_, i) => {
            const pct = percentages[i]
            const isHot = hasEnoughData && pct === maxPct
            const isCold = hasEnoughData && pct === minPct
            const isLast = lastDigit === i
            const size = hasEnoughData ? 50 + (pct / (maxPct || 1)) * 20 : 54

            let bgColor = '#1e1e3a'
            if (isLast) bgColor = '#6c63ff'
            else if (isHot) bgColor = '#22c55e'
            else if (isCold) bgColor = '#ef4444'

            let textColor = '#aaa'
            if (isLast) textColor = '#6c63ff'
            else if (isHot) textColor = '#22c55e'
            else if (isCold) textColor = '#ef4444'

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  background: bgColor,
                  border: isLast ? '3px solid #fff' : '2px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  boxShadow: isLast ? '0 0 15px rgba(108, 99, 255, 0.7)' : 'none',
                  margin: '0 auto'
                }}>
                  {i}
                </div>
                <span style={{ color: textColor, fontSize: '0.75rem', fontWeight: 'bold' }}>
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
          {!hasEnoughData && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>⚠️ Need 50+ ticks for colors</span>}
        </div>
      </div>
    </div>
  )
}