import NavBar from '@/components/NavBar'

export default function Strategies() {
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
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡️ Swift Trade</h1>
        <button
          onClick={() => { localStorage.removeItem('deriv_token'); window.location.href = '/login' }}
          style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <NavBar />

      {/* ── OVER / UNDER STRATEGY (using the Wealth Generator OU bot) ── */}
      <>
        {/* Header */}
        <div style={{ ...cardStyle, borderLeft: '3px solid #22c55e' }}>
          <p style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 'bold', margin: '0 0 0.25rem', letterSpacing: '0.06em' }}>WEALTH GENERATOR OU</p>
          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>Over / Under Strategy</h2>
          <p style={{ color: '#aaa', fontSize: '0.83rem', margin: 0 }}>Use the Analysis tab to spot market momentum and trade in the direction of the dominant digit range using the Wealth Generator OU bot.</p>
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
            { text: <><span style={{ color: '#22c55e', fontWeight: 'bold' }}>If that digit is 5, 6, 7, 8, or 9</span> — trade <span style={{ color: '#22c55e', fontWeight: 'bold' }}>OVER</span> on the Wealth Generator OU bot.</> },
            { text: <><span style={{ color: '#ef4444', fontWeight: 'bold' }}>If that digit is 0, 1, 2, 3, or 4</span> — trade <span style={{ color: '#ef4444', fontWeight: 'bold' }}>UNDER</span> on the Wealth Generator OU bot.</> },
            { text: 'Use that highest-percentage digit as the Entry Digit (First Digit) in Wealth Generator OU.' },
            { text: <>Leave the <span style={{ color: '#fff', fontWeight: 'bold' }}>Second Digit</span> in the bot settings as it is — only change the <span style={{ color: '#fff', fontWeight: 'bold' }}>Over/Under</span> selection and the <span style={{ color: '#fff', fontWeight: 'bold' }}>Entry Digit</span>, unless you're experienced, in which case you can also adjust the Second (recovery) digit.</> },
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

        {/* Risk Disclaimer*/}
        <div style={{ ...alertStyle('#6c63ff'), marginBottom: '1rem' }}>
          <p style={{ color: '#6c63ff', fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.2rem' }}>Risk Disclaimer </p>
          <p style={{ color: '#aaa', fontSize: '0.82rem', margin: 0 }}>Trading financial instruments, including forex, stocks, indices, commodities, cryptocurrencies, and derivatives, involves a high level of risk and may not be suitable for all investors. Past performance does not guarantee future results. All trading decisions are made at your own risk, and you should only trade with funds you can afford to lose..</p>
        </div>
      </>
    </div>
  )
}
