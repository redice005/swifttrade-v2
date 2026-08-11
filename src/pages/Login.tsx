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
      setTickers(prev =>
        prev.map(t => {
          const change = Math.random() * 0.8 - 0.4
          const newPrice = parseFloat((t.price + change).toFixed(2))

          return {
            ...t,
            price: newPrice,
            up: change >= 0,
          }
        })
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const el = tickerRef.current
    if (!el) return

    let pos = 0

    const scroll = () => {
      pos += 0.5

      if (pos >= el.scrollWidth / 2) {
        pos = 0
      }

      el.scrollLeft = pos
    }

    const id = setInterval(scroll, 16)

    return () => clearInterval(id)
  }, [])

  const tickerItems = [...tickers, ...tickers]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080812',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        paddingTop: '3.2rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Background grid and ambient lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 18}%`,
              top: 0,
              width: '1px',
              height: '100%',
              background:
                'linear-gradient(to bottom, transparent, rgba(108, 99, 255, 0.12), transparent)',
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'rgba(108, 99, 255, 0.07)',
            filter: 'blur(70px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.045)',
            filter: 'blur(85px)',
          }}
        />
      </div>

      {/* Background chart */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: 0,
          right: 0,
          zIndex: 0,
          opacity: 0.11,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 400 80" style={{ width: '100%', height: 'auto' }}>
          <polyline
            points="0,60 40,45 80,55 120,30 160,40 200,20 240,35 280,15 320,25 360,10 400,20"
            fill="none"
            stroke="#6c63ff"
            strokeWidth="2"
          />

          <polyline
            points="0,70 40,65 80,70 120,50 160,60 200,45 240,55 280,40 320,50 360,35 400,45"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Market ticker */}
      <div
        ref={tickerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '34px',
          background: 'rgba(8, 8, 18, 0.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.16)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          overflowX: 'hidden',
          zIndex: 10,
          scrollbarWidth: 'none',
        }}
      >
        {tickerItems.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#9ca3af',
              fontSize: '0.7rem',
              whiteSpace: 'nowrap',
              fontFamily:
                '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
              flexShrink: 0,
              paddingLeft: i === 0 ? '1rem' : 0,
              letterSpacing: '0.01em',
            }}
          >
            <span style={{ color: '#d1d5db', fontWeight: 600 }}>
              {t.symbol}
            </span>

            <span
              style={{
                color: t.up ? '#22c55e' : '#ef4444',
                fontSize: '0.62rem',
              }}
            >
              {t.up ? '▲' : '▼'}
            </span>

            <span
              style={{
                color: t.up ? '#4ade80' : '#f87171',
                transition: 'color 0.3s ease',
              }}
            >
              {t.price.toFixed(2)}
            </span>
          </span>
        ))}
      </div>

      {/* Main login card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(20, 20, 35, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '2.5rem 2rem 1.8rem',
          borderRadius: '18px',
          textAlign: 'center',
          border: '1px solid rgba(108, 99, 255, 0.18)',
          boxShadow:
            '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(108, 99, 255, 0.035)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: '0.65rem',
            display: 'flex',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 10px rgba(108, 99, 255, 0.25))',
          }}
        >
          <svg width="34" height="42" viewBox="0 0 36 44" fill="none">
            <path
              d="M21 0L4 24h13L11 44l21-28H19L21 0z"
              fill="#6c63ff"
            />
          </svg>
        </div>

        {/* Brand */}
        <h1
          style={{
            color: '#fff',
            margin: '0 0 0.3rem',
            fontSize: '1.8rem',
            fontWeight: 750,
            letterSpacing: '-0.04em',
          }}
        >
          Swift <span style={{ color: '#8b7cff' }}>Trade</span>
        </h1>

        <p
          style={{
            color: '#8f8f9f',
            margin: '0 0 1.4rem',
            fontSize: '0.82rem',
            letterSpacing: '0.02em',
          }}
        >
          Elite execution platform
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            justifyContent: 'center',
            marginBottom: '1.8rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Manual Trading', type: 'chart' },
            { label: 'Smart Bots', type: 'bot' },
            { label: 'Analysis', type: 'analysis' },
          ].map((f, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(108, 99, 255, 0.09)',
                border: '1px solid rgba(108, 99, 255, 0.22)',
                borderRadius: '999px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.66rem',
                color: '#aaaabd',
                whiteSpace: 'nowrap',
              }}
            >
              {f.type === 'chart' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 19V5M4 19h16M7 15l3-4 3 2 5-7"
                    stroke="#8b7cff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {f.type === 'bot' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="6"
                    width="16"
                    height="13"
                    rx="3"
                    stroke="#8b7cff"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 3v3M8 12h.01M16 12h.01M8 16h8"
                    stroke="#8b7cff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {f.type === 'analysis' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 19V5M4 19h16"
                    stroke="#8b7cff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 15l3-4 3 2 4-6"
                    stroke="#8b7cff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {f.label}
            </span>
          ))}
        </div>

        {/* Login */}
        <button
          onClick={loginWithDeriv}
          style={{
            width: '100%',
            padding: '0.95rem',
            background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.96rem',
            fontWeight: 700,
            marginBottom: '1rem',
            boxShadow: '0 6px 22px rgba(108, 99, 255, 0.28)',
            transition:
              'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow =
              '0 8px 26px rgba(108, 99, 255, 0.38)'
            e.currentTarget.style.filter = 'brightness(1.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow =
              '0 6px 22px rgba(108, 99, 255, 0.28)'
            e.currentTarget.style.filter = 'brightness(1)'
          }}
        >
          Login
        </button>

        {/* Create Deriv account */}
        <div
          style={{
            border: '1px solid rgba(108, 99, 255, 0.16)',
            borderRadius: '11px',
            padding: '1rem',
            marginBottom: '1rem',
            background: 'rgba(108, 99, 255, 0.035)',
          }}
        >
          <p
            style={{
              color: '#a5a5b5',
              fontSize: '0.82rem',
              margin: '0 0 0.7rem',
            }}
          >
            Don't have a Deriv account?
          </p>

          <button
            onClick={() =>
              window.open(
                'https://partner-tracking.deriv.com/click?a=18029&o=1&c=3&link_id=1',
                '_blank'
              )
            }
            style={{
              width: '100%',
              padding: '0.72rem',
              background: 'rgba(108, 99, 255, 0.035)',
              color: '#8b7cff',
              border: '1px solid rgba(108, 99, 255, 0.65)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 700,
              transition:
                'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(108, 99, 255, 0.1)'
              e.currentTarget.style.borderColor = '#8b7cff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(108, 99, 255, 0.035)'
              e.currentTarget.style.borderColor =
                'rgba(108, 99, 255, 0.65)'
            }}
          >
            Create Free Account
          </button>

          <p
            style={{
              color: '#555568',
              fontSize: '0.7rem',
              margin: '0.5rem 0 0',
            }}
          >
            Free sign up · Start with demo account
          </p>
        </div>

        {/* Community */}
        <div
          style={{
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '11px',
            padding: '1rem',
          }}
        >
          <p
            style={{
              color: '#9d9daa',
              fontSize: '0.82rem',
              margin: '0 0 0.75rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            Join our community
          </p>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() =>
                window.open(
                  'https://chat.whatsapp.com/Bab0nFH5uTcFXh4RPcqSVP?s=cl&p=a&ilr=4',
                  '_blank'
                )
              }
              style={{
                flex: 1,
                padding: '0.72rem',
                background: 'rgba(34, 197, 94, 0.08)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.6)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                transition:
                  'background 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background =
                  'rgba(34, 197, 94, 0.14)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background =
                  'rgba(34, 197, 94, 0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              WhatsApp
            </button>

            <button
              onClick={() =>
                window.open(
                  'https://t.me/+c54B-L8UYk42ODI0',
                  '_blank'
                )
              }
              style={{
                flex: 1,
                padding: '0.72rem',
                background: 'rgba(108, 99, 255, 0.08)',
                color: '#8b7cff',
                border: '1px solid rgba(108, 99, 255, 0.6)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                transition:
                  'background 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background =
                  'rgba(108, 99, 255, 0.14)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background =
                  'rgba(108, 99, 255, 0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Telegram
            </button>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            color: '#3f3f4d',
            fontSize: '0.67rem',
            margin: '1.35rem 0 0.7rem',
          }}
        >
          Powered by Deriv · Secure OAuth2 Login
        </p>

        {/* Risk Disclaimer */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.045)',
            paddingTop: '0.8rem',
          }}
        >
          <p
            style={{
              color: '#666675',
              fontSize: '0.64rem',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            <span
              style={{
                color: '#858593',
                fontWeight: 700,
              }}
            >
              Risk Disclaimer
            </span>
            {' — '}
            Trading financial instruments, including forex, stocks, indices,
            commodities, cryptocurrencies, and derivatives, involves a high
            level of risk and may not be suitable for all investors. Past
            performance does not guarantee future results. All trading
            decisions are made at your own risk. Only trade with funds you can
            afford to lose.
          </p>
        </div>
      </div>

      {/* Bottom background chart */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: 0,
          right: 0,
          zIndex: 0,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 400 80" style={{ width: '100%', height: 'auto' }}>
          <polyline
            points="0,40 40,55 80,35 120,50 160,30 200,45 240,25 280,40 320,20 360,35 400,15"
            fill="none"
            stroke="#6c63ff"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}