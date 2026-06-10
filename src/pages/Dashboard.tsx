import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDerivSocket } from '@/hooks/useDerivSocket'

export default function Dashboard() {
  const { logout } = useAuth()
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo')
  const [balance, setBalance] = useState<number | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [market, setMarket] = useState('R_100')
  const [stake, setStake] = useState('10')
  const [duration, setDuration] = useState('5')
  const [contractType, setContractType] = useState('CALL')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { status, send, subscribe } = useDerivSocket('pat_e363fe366ae2a7c904b7f3912f606274f4b8002a06e43574a5c0f1eccb8d2849')

  useEffect(() => {
    if (status !== 'open') return

    const unsub = subscribe((data) => {
      if (data.msg_type === 'authorize') {
        send({ balance: 1, subscribe: 1 })
        send({ ticks: market, subscribe: 1 })
      }
      if (data.msg_type === 'balance') {
        setBalance(data.balance.balance)
        setCurrency(data.balance.currency)
      }
      if (data.msg_type === 'tick') {
        setCurrentPrice(data.tick.quote)
      }
      if (data.msg_type === 'buy') {
        setMessage(data.error ? `Error: ${data.error.message}` : 'Contract placed!')
        setLoading(false)
      }
    })

    return unsub
  }, [status, market])

  const placeContract = (type: string) => {
    if (!send) return
    setLoading(true)
    setMessage('')
    send({
      buy: 1,
      subscribe: 1,
      price: parseFloat(stake),
      parameters: {
        amount: parseFloat(stake),
        basis: 'stake',
        contract_type: type,
        currency: currency,
        duration: parseInt(duration),
        duration_unit: 't',
        symbol: market,
      }
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡ Swift Trade</h1>
        <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setAccountType('demo')}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: accountType === 'demo' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}
          >Demo</button>
          <button
            onClick={() => setAccountType('real')}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: accountType === 'real' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}
          >Real</button>
        </div>
        <p style={{ color: '#aaa', margin: 0 }}>{accountType === 'demo' ? 'Demo' : 'Real'} Account · {currency}</p>
        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2rem' }}>
          {balance !== null ? `${balance.toFixed(2)}` : status === 'open' ? 'Loading...' : 'Connecting...'}
        </h2>
      </div>

      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 0.5rem' }}>Market</p>
        <select
          value={market}
          onChange={e => setMarket(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px' }}
        >
          <option value="R_100">Volatility 100</option>
          <option value="R_75">Volatility 75</option>
          <option value="R_50">Volatility 50</option>
          <option value="R_25">Volatility 25</option>
          <option value="R_10">Volatility 10</option>
        </select>
        {currentPrice && (
          <div style={{ background: '#0a0a1a', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
            <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>CURRENT PRICE</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{currentPrice.toFixed(4)}</h2>
          </div>
        )}
      </div>

      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem' }}>
        <p style={{ color: '#aaa', margin: '0 0 1rem' }}>Place a contract</p>
        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Contract Type</p>
        <select
          value={contractType}
          onChange={e => setContractType(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem' }}
        >
          <option value="CALL">Rise</option>
          <option value="PUT">Fall</option>
        </select>
        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Stake (USD)</p>
        <input
          type="number"
          value={stake}
          onChange={e => setStake(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>Duration (ticks)</p>
        <input
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', marginBottom: '1rem' }}>{message}</p>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => placeContract('CALL')}
            disabled={loading}
            style={{ flex: 1, padding: '1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >⬆ Rise</button>
          <button
            onClick={() => placeContract('PUT')}
            disabled={loading}
            style={{ flex: 1, padding: '1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >⬇ Fall</button>
        </div>
      </div>
    </div>
  )
}