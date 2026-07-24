import { useState } from 'react'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_7vgjvy7'
const EMAILJS_TEMPLATE_ID = 'template_yduud3d'
const EMAILJS_PUBLIC_KEY = 'w9NPAoiHUGJb-hwLL'

export default function Funded() {
  const [showFunding, setShowFunding] = useState(false)
  const [email, setEmail] = useState('')
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [sending, setSending] = useState(false)

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

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(26, 26, 46, 0.95)', backdropFilter: 'blur(20px)', padding: '2.5rem 2rem', borderRadius: '16px', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid rgba(108, 99, 255, 0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        <div style={{ border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem', background: 'rgba(245, 158, 11, 0.04)' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.25rem', letterSpacing: '0.05em' }}>FUNDED TRADING</p>
          <p style={{ color: '#aaa', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
            Don't have capital? Get the opportunity to receive <span style={{ color: '#fff', fontWeight: 'bold' }}>$500</span> in trading capital.
          </p>
          <button
            onClick={() => { setShowFunding(true); setChallengeStarted(false); setEmail(''); setEmailError('') }}
            style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
          >
            Get Funded
          </button>
        </div>
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
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.3rem' }}>Get Funded — $500 Trading Capital</h2>
              </div>
              <button onClick={() => setShowFunding(false)}
                style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>
                ✕
              </button>
            </div>

            <div style={{ background: '#0a0a1a', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.75rem', letterSpacing: '0.05em' }}>FUNDING CONDITIONS</p>
              {[
                { text: 'Trade consistently throughout the 4-week period' },
                { text: 'Maintain responsible risk management' },
                { text: 'Do not lose more than $50 in a single day' },
                { text: 'Traders are selected based on consistency and disciplined trading performance, not simply on the amount of profit generated' },
                { text: 'A 2% share rate applies to funded payouts' },
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
                  Your funding journey has begun!
                </p>
                <p style={{ color: '#aaa', fontSize: '0.83rem', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                  A confirmation has been sent to you,If you don't see our email within a minute, please check your Promotions or Spam{' '}
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{email}</span>.
                  We will notify you at this email address if you are selected to receive $500 in trading capital.
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