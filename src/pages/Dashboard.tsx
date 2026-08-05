import { useState, useEffect, useRef } from 'react'
import { useDeriv } from '@/context/DerivContext'
import NavBar from '@/components/NavBar'

export default function Dashboard() {
  const { status, balance, currency, accountType, setAccountType, send, subscribe } = useDeriv()
  const [market, setMarket] = useState('R_100')
  const [stake, setStake] = useState('10')
  const [duration, setDuration] = useState('1')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [message, setMessage] = useState('')
  const [contractCategory, setContractCategory] = useState('rise_fall')
  const [barrier, setBarrier] = useState('5')

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryPayloadRef = useRef<any>(null)
  const hasRetriedRef = useRef(false)
  const activeContractIdRef = useRef<number | null>(null)
  const tradeActiveRef = useRef(false)

  const clearTradeTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const resetTradeState = () => {
    setLoading(false)
    setPlacing(false)
    tradeActiveRef.current = false
    hasRetriedRef.current = false
    retryPayloadRef.current = null
    activeContractIdRef.current = null
    clearTradeTimeout()
  }

  const startTradeTimeout = (payload: any) => {
    clearTradeTimeout()
    timeoutRef.current = setTimeout(() => {
      if (!hasRetriedRef.current) {
        hasRetriedRef.current = true
        setMessage('Retrying trade...')
        send(payload)
        startTradeTimeout(payload)
      } else {
        resetTradeState()
        setMessage('Trade failed. Please try again.')
      }
    }, 20000)
  }

  useEffect(() => {
    if (status !== 'open') return
    activeContractIdRef.current = null

    const unsub = subscribe((data) => {
      if (data.msg_type === 'tick') {
        setCurrentPrice(data.tick.quote)
      }

      if (data.msg_type === 'proposal') {
        if (!tradeActiveRef.current) return
        clearTradeTimeout()
        if (data.error) {
          resetTradeState()
          setMessage(`Error: ${data.error.message}`)
        } else {
          // Keep placing=true — trade still in flight
          send({ buy: data.proposal.id, price: parseFloat(stake) })
          startTradeTimeout(retryPayloadRef.current)
        }
      }

      if (data.msg_type === 'buy') {
        if (!tradeActiveRef.current) return
        clearTradeTimeout()
        if (data.error) {
          resetTradeState()
          setMessage(`Error: ${data.error.message}`)
        } else {
          // Keep placing=true — waiting for contract to settle
          activeContractIdRef.current = data.buy.contract_id
          send({ proposal_open_contract: 1, subscribe: 1, contract_id: data.buy.contract_id })
        }
      }

      if (data.msg_type === 'proposal_open_contract') {
        const contract = data.proposal_open_contract
        if (contract.contract_id !== activeContractIdRef.current) return
        if (contract.status === 'won') {
          resetTradeState()
          setMessage(`Won! Profit: +${contract.profit} ${currency}`)
        } else if (contract.status === 'lost') {
          resetTradeState()
          setMessage(`Lost! -${contract.buy_price} ${currency}`)
        }
      }
    })

    send({ ticks: market, subscribe: 1 })
    return () => { unsub() }
  }, [status, market])

  const placeContract = (type: string) => {
    if (!send || tradeActiveRef.current) return
    tradeActiveRef.current = true
    hasRetriedRef.current = false
    setLoading(true)
    setPlacing(true)
    setMessage('')

    const payload: any = {
      proposal: 1,
      amount: parseFloat(stake),
      basis: 'stake',
      contract_type: type,
      currency: currency,
      duration: parseInt(duration),
      duration_unit: 't',
      underlying_symbol: market,
      subscribe: 1
    }
    if (type === 'DIGITOVER' || type === 'DIGITUNDER') {
      payload.barrier = barrier
    }

    retryPayloadRef.current = payload
    send(payload)
    startTradeTimeout(payload)
  }

  const logout = () => {
    localStorage.removeItem('deriv_token')
    window.location.href = '/login'
  }

  const messageColor = () => {
    if (message.includes('Error') || message.includes('failed')) return '#ef4444'
    if (message.includes('Won')) return '#22c55e'
    if (message.includes('Lost')) return '#ef4444'
    if (message.includes('Retry')) return '#f59e0b'
    return '#aaa'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>
      <style>{`
        @keyframes placing-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .placing-indicator {
          animation: placing-pulse 1.1s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡️ Swift Trade</h1>
        <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
      <NavBar />

      {/* Balance Card */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', width: 'fit-content' }}>
          <button onClick={() => setAccountType('demo')}
            style={{ padding: '0.2rem 0.9rem', borderRadius: '6px', border: 'none', background: accountType === 'demo' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold' }}>
            Demo
          </button>
          <button onClick={() => setAccountType('real')}
            style={{ padding: '0.2rem 0.9rem', borderRadius: '6px', border: 'none', background: accountType === 'real' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold' }}>
            Real
          </button>
        </div>

        <p style={{ color: '#aaa', margin: 0, fontSize: '0.8rem' }}>{accountType === 'demo' ? 'Demo' : 'Real'} Account · {currency}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          {balance !== null ? (
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{balance.toFixed(2)}</h2>
          ) : (
            <span style={{ color: '#666', fontSize: '13px' }}>Loading...</span>
          )}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => window.open('https://home.deriv.com/dashboard/deposit?from=home', '_blank')}
              style={{ padding: '0.3rem 0.5rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
              Deposit
            </button>
            <button
              onClick={() => window.open('https://home.deriv.com/dashboard/transfer?from=home', '_blank')}
              style={{ padding: '0.3rem 0.5rem', background: 'rgba(108,99,255,0.15)', color: '#6c63ff', border: '1px solid #6c63ff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
              Transfer
            </button>
            <button
              onClick={() => window.open('https://home.deriv.com/dashboard/withdraw?from=home', '_blank')}
              style={{ padding: '0.3rem 0.5rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Market */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 0.5rem' }}>Market</p>
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
        {currentPrice && (
          <div style={{ background: '#060607', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
            <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>CURRENT PRICE</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{currentPrice.toFixed(4)}</h2>
          </div>
        )}
      </div>

      {/* Place Contract */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 1rem' }}>Place a contract</p>

        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Contract Type</p>
        <select value={contractCategory} onChange={e => setContractCategory(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem' }}>
          <option value="rise_fall">Rise / Fall</option>
          <option value="even_odd">Even / Odd</option>
          <option value="over_under">Over / Under</option>
        </select>

        {contractCategory === 'over_under' && <>
          <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Barrier (0-9)</p>
          <select value={barrier} onChange={e => setBarrier(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem' }}>
            {[0,1,2,3,4,5,6,7,8,9].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </>}

        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Stake (USD)</p>
        <input type="number" value={stake} onChange={e => setStake(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }} />

        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Duration (ticks)</p>
        <input type="number" value={duration} min="1" onChange={e => setDuration(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }} />

        {placing && (
          <p className="placing-indicator" style={{ color: '#6c63ff', marginBottom: '1rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Placing trade...
          </p>
        )}
        {!placing && message && (
          <p style={{ color: messageColor(), marginBottom: '1rem', fontWeight: 'bold' }}>
            {message}
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {contractCategory === 'rise_fall' && <>
            <button onClick={() => placeContract('CALL')} disabled={loading}
              style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              Rise</button>
            <button onClick={() => placeContract('PUT')} disabled={loading}
              style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              Fall</button>
          </>}
          {contractCategory === 'even_odd' && <>
            <button onClick={() => placeContract('DIGITEVEN')} disabled={loading}
              style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              Even</button>
            <button onClick={() => placeContract('DIGITODD')} disabled={loading}
              style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              Odd</button>
          </>}
          {contractCategory === 'over_under' && <>
            <button onClick={() => placeContract('DIGITOVER')} disabled={loading}
              style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              Over {barrier}</button>
            <button onClick={() => placeContract('DIGITUNDER')} disabled={loading}
              style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              Under {barrier}</button>
          </>}
        </div>
      </div>
    </div>
  )
}