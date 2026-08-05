import { useState } from 'react'
import NavBar from '@/components/NavBar'

export default function Strategies() {
  const [activeStrategy, setActiveStrategy] = useState<'eo' | 'ou'>('eo')

  const cardStyle = {
    background: '#1a1a2e',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
  }

  const stepStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.85rem',
  }

  const numberStyle = {
    background: '#6c63ff',
    color: '#fff',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    flexShrink: 0,
    marginTop: '0.1rem',
  }

  const textStyle = {
    color: '#ccc',
    fontSize: '0.88rem',
    lineHeight: '1.5',
    margin: 0,
  }

  const tagStyle = (color: string) => ({
    display: 'inline-block',
    background: `${color}22`,
    color: color,
    border: `1px solid ${color}55`,
    borderRadius: '6px',
    padding: '0.15rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginRight: '0.3rem',
  })

  const alertStyle = (color: string) => ({
    background: `${color}11`,
    border: `1px solid ${color}44`,
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    marginBottom: '0.85rem',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>Swift Trade</h1>
        <button
          onClick={() => { localStorage.removeItem('deriv_token'); window.location.href = '/login' }}
          style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <NavBar />

      {/* Strategy Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setActiveStrategy('eo')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: activeStrategy === 'eo' ? '#6c63ff' : '#1a1a2e', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
          Even / Odd Strategy
        </button>
        <button
          onClick={() => setActiveStrategy('ou')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: activeStrategy === 'ou' ? '#6c63ff' : '#1a1a2e', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
          Over / Under Strategy
        </button>
      </div>

      {/* ── EVEN / ODD STRATEGY ── */}
      {activeStrategy === 'eo' && (
        <>
          {/* Header */}
          <div style={{ ...cardStyle, borderLeft: '3px solid #6c63ff' }}>
            <p style={{ color: '#6c63ff', fontSize: '0.72rem', fontWeight: 'bold', margin: '0 0 0.25rem', letterSpacing: '0.06em' }}>WEALTH GENERATOR EO</p>
            <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>Even / Odd Strategy</h2>
            <p style={{ color: '#aaa', fontSize: '0.83rem', margin: 0 }}>A digit distribution approach. Read the Analysis tab and let the market tell you which side to trade.</p>
          </div>

          {/* Digit classes */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.75rem', letterSpacing: '0.05em' }}>DIGIT CLASSES</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, background: '#0a0a1a', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ color: '#6c63ff', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>EVEN DIGITS</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {[0,2,4,6,8].map(n => (
                    <span key={n} style={{ ...tagStyle('#6c63ff') }}>{n}</span>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, background: '#0a0a1a', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>ODD DIGITS</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {[1,3,5,7,9].map(n => (
                    <span key={n} style={{ ...tagStyle('#f59e0b') }}>{n}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 1rem', letterSpacing: '0.05em' }}>STEP BY STEP</p>

            {[
              { text: 'Open the Analysis tab and select a Volatility Index market.' },
              { text: 'Look at the digit distribution circles (0–9) and identify the two digits with the highest percentages.' },
              { text: 'Check whether those two top digits belong to the same class — both Even, or both Odd.' },
              { text: <><span style={{ color: '#22c55e', fontWeight: 'bold' }}>If both are EVEN</span> — trade <span style={{ color: '#22c55e', fontWeight: 'bold' }}>EVEN</span> using Wealth Generator EO.</> },
              { text: <><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>If both are ODD</span> — trade <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>ODD</span> using Wealth Generator EO.</> },
              { text: <><span style={{ color: '#ef4444', fontWeight: 'bold' }}>If one is Even and one is Odd</span> — the setup is not valid. Skip the trade entirely.</> },
              { text: 'Use the second-highest percentage digit as the Entry Digit in the bot settings.' },
            ].map((step, i) => (
              <div key={i} style={stepStyle as any}>
                <div style={numberStyle as any}>{i + 1}</div>
                <p style={textStyle}>{step.text}</p>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.85rem', letterSpacing: '0.05em' }}>EXAMPLES</p>

            <div style={alertStyle('#22c55e')}>
              <p style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.3rem' }}>Example 1 — Trade EVEN</p>
              <p style={{ color: '#ccc', fontSize: '0.83rem', margin: 0 }}>Digit 8 (highest): 12.5% &nbsp;·&nbsp; Digit 4 (second): 11.8%</p>
              <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>Both Even → Trade EVEN. Entry Digit: <strong style={{ color: '#fff' }}>4</strong></p>
            </div>

            <div style={alertStyle('#f59e0b')}>
              <p style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.3rem' }}>Example 2 — Trade ODD</p>
              <p style={{ color: '#ccc', fontSize: '0.83rem', margin: 0 }}>Digit 7 (highest): 13.2% &nbsp;·&nbsp; Digit 3 (second): 12.1%</p>
              <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>Both Odd → Trade ODD. Entry Digit: <strong style={{ color: '#fff' }}>3</strong></p>
            </div>

            <div style={alertStyle('#ef4444')}>
              <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.3rem' }}>Example 3 — Skip</p>
              <p style={{ color: '#ccc', fontSize: '0.83rem', margin: 0 }}>Digit 6 (highest): 12.0% &nbsp;·&nbsp; Digit 3 (second): 11.5%</p>
              <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>Mixed Even/Odd → No valid setup. Do not trade.</p>
            </div>
          </div>

          {/* Checklist */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.85rem', letterSpacing: '0.05em' }}>QUICK CHECKLIST</p>
            {[
              'Open Analysis tab',
              'Select a Volatility Index',
              'Find the two highest-percentage digits',
              'Confirm both are Even or both are Odd',
              'If mixed Even/Odd — skip the trade',
              'Use the second-highest digit as Entry Digit',
              'Open Wealth Generator EO',
              'Select Even or Odd based on the valid condition',
              'Enter the second-highest digit as Entry Digit',
              'Familiarise on Demo before trading Real money',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.55rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '0.1rem' }}>—</span>
                <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Demo reminder */}
          <div style={{ ...alertStyle('#6c63ff'), marginBottom: '1rem' }}>
            <p style={{ color: '#6c63ff', fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.2rem' }}>Use Demo First</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', margin: 0 }}>Always practise this strategy on a Demo account before using real money. Familiarise yourself with reading the digit distribution correctly.</p>
          </div>
        </>
      )}

      {/* ── OVER / UNDER STRATEGY ── */}
      {activeStrategy === 'ou' && (
        <>
          {/* Header */}
          <div style={{ ...cardStyle, borderLeft: '3px solid #22c55e' }}>
            <p style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 'bold', margin: '0 0 0.25rem', letterSpacing: '0.06em' }}>WEALTH GENERATOR OU</p>
            <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>Over / Under Strategy</h2>
            <p style={{ color: '#aaa', fontSize: '0.83rem', margin: 0 }}>Use the Analysis tab to spot market momentum and trade in the direction of the dominant digit range.</p>
          </div>

          {/* Digit ranges */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.75rem', letterSpacing: '0.05em' }}>DIGIT RANGES</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, background: '#0a0a1a', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>OVER RANGE</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {[5,6,7,8,9].map(n => (
                    <span key={n} style={{ ...tagStyle('#22c55e') }}>{n}</span>
                  ))}
                </div>
                <p style={{ color: '#555', fontSize: '0.72rem', margin: '0.5rem 0 0' }}>Highest digit in 5–9 → Trade Over</p>
              </div>
              <div style={{ flex: 1, background: '#0a0a1a', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>UNDER RANGE</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {[0,1,2,3,4].map(n => (
                    <span key={n} style={{ ...tagStyle('#ef4444') }}>{n}</span>
                  ))}
                </div>
                <p style={{ color: '#555', fontSize: '0.72rem', margin: '0.5rem 0 0' }}>Highest digit in 0–4 → Trade Under</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 1rem', letterSpacing: '0.05em' }}>STEP BY STEP</p>
            {[
              { text: 'Open the Analysis tab and select a Volatility Index market.' },
              { text: 'Look at the digit distribution circles (0–9) and spot the digit with the highest percentage.' },
              { text: <><span style={{ color: '#22c55e', fontWeight: 'bold' }}>If that digit is 5, 6, 7, 8, or 9</span> — trade <span style={{ color: '#22c55e', fontWeight: 'bold' }}>OVER</span> on the bot.</> },
              { text: <><span style={{ color: '#ef4444', fontWeight: 'bold' }}>If that digit is 0, 1, 2, 3, or 4</span> — trade <span style={{ color: '#ef4444', fontWeight: 'bold' }}>UNDER</span> on the bot.</> },
              { text: 'Use that highest-percentage digit as the Entry Digit (First Digit) in Wealth Generator OU.' },
              { text: 'Set a recovery digit as the Second Digit in the bot settings.' },
              { text: 'Keep runs short — aim for 3 trades per session as markets can be volatile.' },
              { text: 'If the bot takes a loss and recovers on the next trade — stop the bot immediately and secure the profit.' },
              { text: 'Practise on Demo first before using real money.' },
            ].map((step, i) => (
              <div key={i} style={stepStyle as any}>
                <div style={numberStyle as any}>{i + 1}</div>
                <p style={textStyle}>{step.text}</p>
              </div>
            ))}
          </div>

          {/* Example */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.85rem', letterSpacing: '0.05em' }}>EXAMPLES</p>

            <div style={alertStyle('#22c55e')}>
              <p style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.3rem' }}>Example 1 — Trade OVER</p>
              <p style={{ color: '#ccc', fontSize: '0.83rem', margin: 0 }}>Highest digit: <strong style={{ color: '#fff' }}>7</strong> at 14.2%</p>
              <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>7 is in range 5–9 → Trade OVER. Entry Digit: <strong style={{ color: '#fff' }}>7</strong></p>
            </div>

            <div style={alertStyle('#ef4444')}>
              <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', margin: '0 0 0.3rem' }}>Example 2 — Trade UNDER</p>
              <p style={{ color: '#ccc', fontSize: '0.83rem', margin: 0 }}>Highest digit: <strong style={{ color: '#fff' }}>2</strong> at 13.5%</p>
              <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>2 is in range 0–4 → Trade UNDER. Entry Digit: <strong style={{ color: '#fff' }}>2</strong></p>
            </div>
          </div>

          {/* Key rules */}
          <div style={cardStyle}>
            <p style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.85rem', letterSpacing: '0.05em' }}>KEY RULES</p>
            {[
              { color: '#22c55e', text: 'Max 3 trade runs per session — markets shift fast.' },
              { color: '#f59e0b', text: 'Recovery win? Stop the bot immediately and secure your profit.' },
              { color: '#6c63ff', text: 'Always use Demo account to practise before trading real money.' },
              { color: '#ef4444', text: 'Never chase losses — if the session goes wrong, stop and reset.' },
            ].map((rule, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ color: rule.color, flexShrink: 0, marginTop: '0.1rem', fontWeight: 'bold' }}>—</span>
                <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0 }}>{rule.text}</p>
              </div>
            ))}
          </div>

          {/* Demo reminder */}
          <div style={{ ...alertStyle('#6c63ff'), marginBottom: '1rem' }}>
            <p style={{ color: '#6c63ff', fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.2rem' }}>Use Demo First</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', margin: 0 }}>Always practise on Demo before trading real money. Get comfortable spotting the dominant digit before committing real funds.</p>
          </div>
        </>
      )}
    </div>
  )
}