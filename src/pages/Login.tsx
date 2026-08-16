import { useState, useEffect } from 'react'
import { loginWithDeriv } from '@/lib/auth'

const TICKER_BASE = [
  { symbol: 'V100', price: 346.61 },
  { symbol: 'V75', price: 521.23 },
  { symbol: 'V50', price: 1204.55 },
  { symbol: 'V25', price: 842.10 },
  { symbol: 'V10', price: 2341.89 },
  { symbol: 'V100(1s)', price: 346.81 },
]

const LOADING_MESSAGES = [
  'Initializing secure environment...',
  'Connecting to market engine...',
  'Synchronizing market data...',
  'Loading trading environment...',
  'Preparing execution systems...',
  'Securing authentication layer...',
  'Finalizing platform...',
]

export default function Login() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)

  const [tickers, setTickers] = useState(
    TICKER_BASE.map(t => ({ ...t, up: Math.random() > 0.5 }))
  )

  /* ================================
     INITIAL PLATFORM LOADER
     EXACTLY 4 SECONDS
     ================================ */
  useEffect(() => {
    const duration = 4000
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime

      const percentage = Math.min(
        100,
        Math.floor((elapsed / duration) * 100)
      )

      setProgress(percentage)

      if (percentage >= 100) {
        clearInterval(interval)

        setTimeout(() => {
          setIsLoading(false)
        }, 450)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [])

  /* ================================
     LOADING STATUS TEXT
     ================================ */
  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setStatusIndex(prev =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      )
    }, 570)

    return () => clearInterval(interval)
  }, [isLoading])

  /* ================================
     LIVE TICKERS
     ================================ */
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

  const tickerItems = [...tickers, ...tickers]

  /* ================================
     PREMIUM LOADING SCREEN
     ================================ */
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#080812',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'rgba(108, 99, 255, 0.08)',
            filter: 'blur(100px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              'linear-gradient(rgba(108,99,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.055) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(circle at center, black 0%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 0%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Loader container */}
        <div
          style={{
            width: 'min(420px, 88%)',
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: '78px',
              height: '78px',
              margin: '0 auto 1.5rem',
              borderRadius: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(145deg, rgba(108,99,255,0.18), rgba(139,92,246,0.05))',
              border: '1px solid rgba(139,124,255,0.28)',
              boxShadow:
                '0 0 45px rgba(108,99,255,0.15), inset 0 0 25px rgba(108,99,255,0.05)',
              animation: 'swiftPulse 2s ease-in-out infinite',
            }}
          >
            <svg width="34" height="42" viewBox="0 0 36 44" fill="none">
              <path
                d="M21 0L4 24h13L11 44l21-28H19L21 0z"
                fill="#8b7cff"
              />
            </svg>
          </div>

          {/* Brand */}
          <div
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.045em',
              marginBottom: '0.25rem',
            }}
          >
            Swift <span style={{ color: '#8b7cff' }}>Trade</span>
          </div>

          <div
            style={{
              color: '#555568',
              fontSize: '0.64rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '3rem',
            }}
          >
            Elite Execution Platform
          </div>

          {/* Progress heading */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.55rem',
            }}
          >
            <span
              style={{
                color: '#8f8f9f',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {progress >= 100
                ? 'System Ready'
                : 'Initializing SwiftTrade'}
            </span>

            <span
              style={{
                color: '#8b7cff',
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily:
                  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: '3px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: '999px',
                background:
                  'linear-gradient(90deg, #6c63ff, #8b5cf6, #a78bfa)',
                boxShadow: '0 0 14px rgba(139,124,255,0.65)',
                transition: 'width 0.08s linear',
              }}
            />
          </div>

          {/* Loading status */}
          <div
            style={{
              height: '34px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.45rem',
              marginTop: '1rem',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#8b7cff',
                boxShadow: '0 0 8px rgba(139,124,255,0.8)',
                animation: 'swiftDot 1s ease-in-out infinite',
              }}
            />

            <span
              style={{
                color: '#626273',
                fontSize: '0.68rem',
              }}
            >
              {progress >= 100
                ? 'Secure connection established'
                : LOADING_MESSAGES[statusIndex]}
            </span>
          </div>

          {/* Technical status */}
          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1.2rem',
              color: '#333342',
              fontSize: '0.58rem',
              fontFamily:
                '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
              letterSpacing: '0.08em',
            }}
          >
            <span>SECURE</span>
            <span>•</span>
            <span>REAL-TIME</span>
            <span>•</span>
            <span>DERIV</span>
          </div>
        </div>

        {/* Loader animations */}
        <style>
          {`
            @keyframes swiftPulse {
              0%, 100% {
                transform: scale(1);
                box-shadow:
                  0 0 45px rgba(108,99,255,0.15),
                  inset 0 0 25px rgba(108,99,255,0.05);
              }

              50% {
                transform: scale(1.035);
                box-shadow:
                  0 0 65px rgba(108,99,255,0.24),
                  inset 0 0 30px rgba(108,99,255,0.08);
              }
            }

            @keyframes swiftDot {
              0%, 100% {
                opacity: 0.35;
                transform: scale(0.8);
              }

              50% {
                opacity: 1;
                transform: scale(1.15);
              }
            }
          `}
        </style>
      </div>
    )
  }

  /* ================================
     LOGIN PAGE
     ================================ */
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

      {/* Market ticker — VISIBLE RIGHT → LEFT SCROLL */}
      <div
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
          overflow: 'hidden',
          zIndex: 10,
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            width: 'max-content',
            flexShrink: 0,
            animation: 'swiftTickerScroll 18s linear infinite',
            willChange: 'transform',
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
          animation: 'loginAppear 0.55s ease-out',
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
          Login with Deriv
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
              e.currentTarget.style.background =
                'rgba(108, 99, 255, 0.035)'
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

        {/* Contact & Support */}
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
              margin: '0 0 0.4rem',
              paddingBottom: '0.5rem',
            }}
          >
            Contact & Support
          </p>

          <p
            style={{
              color: '#666675',
              fontSize: '0.7rem',
              margin: '0 0 0.75rem',
            }}
          >
            Need assistance? Our support team is here to help.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() =>
                window.open(
                  'https://wa.me/254781560029',
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
              WhatsApp Support
            </button>

            <button
              onClick={() =>
                window.open(
                  'https://t.me/swifttrad3',
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
              Telegram Community
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

      {/* Animations */}
      <style>
        {`
          @keyframes loginAppear {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.985);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* REAL VISIBLE RIGHT → LEFT TICKER */
          @keyframes swiftTickerScroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  )
}