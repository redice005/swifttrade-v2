import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { loginWithDeriv } from '@/lib/auth'

const EMAILJS_SERVICE_ID = 'service_7vgjvy7'
const EMAILJS_TEMPLATE_ID = 'template_yduud3d'
const EMAILJS_PUBLIC_KEY = 'w9NPAoiHUGJb-hwLL'

const TICKER_BASE = [
  { symbol: 'V100', price: 346.61 },
  { symbol: 'V75', price: 521.23 },
  { symbol: 'V50', price: 1204.55 },
  { symbol: 'V25', price: 842.10 },
  { symbol: 'V10', price: 2341.89 },
  { symbol: 'V100(1s)', price: 346.81 },
]

export default function Login() {
  const [showFunding, setShowFunding] = useState(false)
  const [email, setEmail] = useState('')
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [sending, setSending] = useState(false)
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

  const handleStartChallenge = async () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setEmailError('Enter a valid email')
      return
    }
    const existing = JSON.parse(localStorage.getItem('funded_emails') || '[]')
    if (existing.includes(email.toLowerCase())) {
      setEmailError('This email is already on track')
      return
    }
    setSending(true)
    setEmailError('')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          to_name: email.split('@')[0],
          reply_to: 'noreply@swifttrade.pro',
        },
        EMAILJS_PUBLIC_KEY
      )
      existing.push(email.toLowerCase())
      localStorage.setItem('funded_emails', JSON.stringify(existing))
      setChallengeStarted(true)
    } catch {
      setEmailError('Failed to send email. Please try again.')
    } finally {
      setSending(false)
    }
  }

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

        <div style={{ border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', background: 'rgba(245, 158, 11, 0.04)' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.25rem', letterSpacing: '0.05em' }}>FUNDED TRADING</p>
          <p style={{ color: '#aaa', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
            Don't have capital? Get funded trading capital from <span style={{ color: '#fff', fontWeight: 'bold' }}>$500 USD</span>
          </p>
          <button
            onClick={() => { setShowFunding(true); setChallengeStarted(false); setEmail(''); setEmailError('') }}
            style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
          >
            Get Funded
          </button>
        </div>

        <div style={{ border: '1px solid #222', borderRadius: '10px', padding: '1rem' }}>
          <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1a1a2e' }}>Join our community</p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => window.open('https://whatsapp.com/channel/0029Vb8jxUtISTkBfBpxiO1Y')}
              style={{ flex: 1, padding: '0.75rem', background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              WhatsApp
            </button>
            <button
              onClick={() => window.open('https://t.me/swifttrad3', '_blank')}
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

      {showFunding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#1a1a2e', borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '400px',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 'bold', margin: '0 0 0.2rem', letterSpacing: '0.06em' }}>FUNDED CHALLENGE</p>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.3rem' }}>Get $500 Trading Capital</h2>
              </div>
              <button onClick={() => setShowFunding(false)}
                style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>
                ✕
              </button>
            </div>

            <div style={{ background: '#0a0a1a', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.75rem', letterSpacing: '0.05em' }}>CHALLENGE RULES</p>
              {[
                { text: 'Deposit a minimum of $1 on a real Deriv account' },
                { text: 'Trade for 5 consecutive days' },
                { text: 'Hit a minimum profit of $10 per day' },
                { text: 'Do not lose more than $50 in a single day' },
                { text: '2% share rate applied on your funded payouts' },
              ].map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: i < 4 ? '0.6rem' : 0 }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.8rem', flexShrink: 0, marginTop: '0.1rem' }}>—</span>
                  <p style={{ color: '#ccc', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>{rule.text}</p>
                </div>
              ))}
            </div>

            {!challengeStarted ? (
              <>
                <p style={{ color: '#aaa', fontSize: '0.82rem', margin: '0 0 0.5rem' }}>Enter your email to start tracking:</p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  style={{
                    width: '100%', padding: '0.75rem',
                    background: '#0a0a1a', color: '#fff',
                    border: emailError ? '1px solid #ef4444' : '1px solid #333',
                    borderRadius: '8px', fontSize: '0.9rem',
                    boxSizing: 'border-box' as const,
                    marginBottom: '0.4rem', outline: 'none'
                  }}
                />
                {emailError && (
                  <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '0 0 0.75rem' }}>{emailError}</p>
                )}
                {!emailError && <div style={{ height: '0.75rem' }} />}
                <button
                  onClick={handleStartChallenge}
                  disabled={sending}
                  style={{
                    width: '100%', padding: '0.85rem',
                    background: sending ? '#555' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    fontSize: '1rem', fontWeight: 'bold',
                    boxShadow: sending ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {sending ? 'Sending...' : 'Start Challenge'}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <p style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1rem', margin: '0 0 0.5rem' }}>
                  You are on track!
                </p>
                <p style={{ color: '#aaa', fontSize: '0.83rem', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                  A confirmation has been sent to you,If you don't see our email within a minute, please check your Promotions or Spam{' '}
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{email}</span>.
                  We will email you as soon as the funding condition is met.
                </p>
                <button
                  onClick={() => setShowFunding(false)}
                  style={{
                    width: '100%', padding: '0.75rem',
                    background: 'transparent', color: '#6c63ff',
                    border: '1px solid #6c63ff', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold'
                  }}
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}