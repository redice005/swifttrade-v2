import { useState, useEffect, useRef } from 'react'
import { loginWithDeriv } from '@/lib/auth'

const TICKER_BASE = [
  { symbol: 'V100', price: 346.61 },
  { symbol: 'V75', price: 521.23 },
  { symbol: 'V50', price: 1204.55 },
  { symbol: 'V25', price: 842.10 },
  { symbol: 'V10', price: 2341.89 },
  { symbol: 'V100(1s)', price: 346.81 },
]

export default function Login() {
  const [tickers, setTickers] = useState(
    TICKER_BASE.map(t => ({ ...t, up: Math.random() > 0.5 }))
  )
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const change = (Math.random() * 0.8 - 0.4)
        const newPrice = parseFloat((t.price + change).toFixed(2))
        return { ...t, price: newPrice, up: change >= 0 }
      }))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const el = tickerRef.current
    if (!el) return
    let pos = 0
    const scroll = () => {
      pos += 0.5
      if (pos >= el.scrollWidth / 2) pos = 0
      el.scrollLeft = pos
    }
    const id = setInterval(scroll, 16)
    return () => clearInterval(id)
  }, [])

  const tickerItems = [...tickers, ...tickers]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', paddingTop: '3rem', position: 'relative', overflow: 'hidden' }}>

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
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(108, 99, 255, 0.08)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.06)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'absolute', top: '5%', left: 0, right: 0, zIndex: 0, opacity: 0.15 }}>
        <svg viewBox="0 0 400 80" style={{ width: '100%' }}>
          <polyline points="0,60 40,45 80,55 120,30 160,40 200,20 240,35 280,15 320,25 360,10 400,20" fill="none" stroke="#6c63ff" strokeWidth="2" />
          <polyline points="0,70 40,65 80,70 120,50 160,60 200,45 240,55 280,40 320,50 360,35 400,45" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
      </div>

      <div
        ref={tickerRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: 'rgba(10, 10, 26, 0.95)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.2)',
          padding: '0.4rem 0',
          display: 'flex',
          gap: '2rem',
          overflowX: 'hidden',
          zIndex: 10,
          scrollbarWidth: 'none',
        }}
      >
        {tickerItems.map((t, i) => (
          <span key={i} style={{
            color: t.up ? '#22c55e' : '#ef4444',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            flexShrink: 0,
            paddingLeft: i === 0 ? '1rem' : 0,
            transition: 'color 0.3s ease',
          }}>
            {t.symbol} {t.up ? '▲' : '▼'} {t.price.toFixed(2)}
          </span>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(26, 26, 46, 0.95)', backdropFilter: 'blur(20px)', padding: '2.5rem 2rem', borderRadius: '16px', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid rgba(108, 99, 255, 0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
            <path d="M21 0L4 24h13L11 44l21-28H19L21 0z" fill="#6c63ff" />
          </svg>
        </div>

        <h1 style={{ color: '#fff', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 'bold' }}>
          Swift <span style={{ color: '#6c63ff' }}>Trade</span>
        </h1>
        <p style={{ color: '#aaa', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Elite execution platform</p>

        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {[
            { label: 'Manual Trading', icon: '📈' },
            { label: 'Smart Bots', icon: '' },
            { label: 'Analysis', icon: '' },
          ].map((f, i) => (
            <span key={i} style={{
              background: 'rgba(108, 99, 255, 0.15)',
              border: '1px solid rgba(108, 99, 255, 0.3)',
              borderRadius: '20px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.68rem',
              color: '#aaa',
              whiteSpace: 'nowrap',
            }}>
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        <button
          onClick={loginWithDeriv}
          style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', boxShadow: '0 4px 15px rgba(108, 99, 255, 0.4)' }}
        >
          Login
        </button>

        <div style={{ border: '1px solid rgba(108, 99, 255, 0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', background: 'rgba(108, 99, 255, 0.04)' }}>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Don't have a Deriv account?</p>
          <button
            onClick={() => window.open('https://partner-tracking.deriv.com/click?a=18029&o=1&c=3&link_id=1', '_blank')}
            style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
          >
            Create Free Account
          </button>
          <p style={{ color: '#555', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>Free sign up · Start with demo account</p>
        </div>

        <div style={{ border: '1px solid #222', borderRadius: '10px', padding: '1rem' }}>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1a1a2e' }}>Join our community</p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => window.open('https://chat.whatsapp.com/Bd5AanIbxBQ2l9jnVZhUMY?s=cl&p=a&ilr=4')}
              style={{ flex: 1, padding: '0.75rem', background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              WhatsApp
            </button>
            <button
              onClick={() => window.open('https://t.me/+c54B-L8UYk42ODI0', '_blank')}
              style={{ flex: 1, padding: '0.75rem', background: 'rgba(108, 99, 255, 0.12)', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              Telegram
            </button>
          </div>
        </div>

        <p style={{ color: '#333', fontSize: '0.7rem', marginTop: '1.5rem' }}>Powered by Deriv · Secure OAuth2 Login</p>
      </div>

      <div style={{ position: 'absolute', bottom: '5%', left: 0, right: 0, zIndex: 0, opacity: 0.15 }}>
        <svg viewBox="0 0 400 80" style={{ width: '100%' }}>
          <polyline points="0,40 40,55 80,35 120,50 160,30 200,45 240,25 280,40 320,20 360,35 400,15" fill="none" stroke="#6c63ff" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}
