import { useState, useEffect } from 'react'
import { useDerivSocket } from '@/hooks/useDerivSocket'
import { getDerivAccounts, getDerivWebSocketUrl } from '@/lib/deriv'

export default function Dashboard() {
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo')
  const [balance, setBalance] = useState<number | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [market, setMarket] = useState('R_100')
  const [stake, setStake] = useState('10')
  const [duration, setDuration] = useState('5')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<any[]>([])

  const { status, send, subscribe } = useDerivSocket(wsUrl)

  const token = localStorage.getItem('deriv_token')

  useEffect(() => {
    if (!token) return

    getDerivAccounts(token).then(async (accs) => {
      if (!accs || accs.length === 0) return
      setAccounts(accs)

      const acc = accs.find((a: any) => a.account_type === accountType) || accs[0]
      const url = await getDerivWebSocketUrl(acc.account_id, token, accountType)
      setWsUrl(url)
    })
  }, [token, accountType])

  useEffect(() => {
    if (status !== 'open') return

    const unsub = subscribe((data) => {
      if (data.msg_type === 'balance') {
        setBalance(data.balance.balance)
        setCurrency(data.balance.currency)
      }
      if (data.msg_type === 'tick') {
        setCurrentPrice(data.tick.quote)
      }
      if (data.msg_type === 'proposal') {
        if (data.error) {
          setMessage(`Error: ${data.error.message}`)
          setLoading(false)
        } else {
          send({ buy: data.proposal.id, price: parseFloat(stake) })
        }
      }
      if (data.msg_type === 'buy') {
        if (data.error) {
          setMessage(`Error: ${data.error.message}`)
          setLoading(false)
        } else {
          send({ proposal_open_contract: 1, subscribe: 1, contract_id: data.buy.contract_id })
        }
      }
      if (data.msg_type === 'proposal_open_contract') {
        const contract = data.proposal_open_contract
        if (contract.status === 'won') {
          setMessage(`✅ Won! Profit: +${contract.profit} ${currency}`)
          setLoading(false)
        } else if (contract.status === 'lost') {
          setMessage(`❌ Lost! -${contract.buy_price} ${currency}`)
          setLoading(false)
        }
      }
    })

    send({ balance: 1, subscribe: 1 })
    send({ ticks: market, subscribe: 1 })

    return () => { unsub() }
  }, [status, market])

  const placeContract = (type: string) => {
    if (!send) return
    setLoading(true)
    setMessage('')
    send({
      proposal: 1,
      amount: parseFloat(stake),
      basis: 'stake',
      contract_type: type,
      currency: currency,
      duration: parseInt(duration),
      duration_unit: 't',
      underlying_symbol: market,
      subscribe: 1
    })
  }

  const logout = () => {
    localStorage.removeItem('deriv_token')
    window.location.href = '/login'
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
          min="1"
          max="5"
          onChange={e => setDuration(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        {message && (
          <p style={{ 
            color: message.includes('Error') ? 'red' : message.includes('Won') ? '#22c55e' : '#ef4444', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>{message}</p>
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => placeContract('CALL')}
            disabled={loading}
            style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >⬆ Rise</button>
          <button
            onClick={() => placeContract('PUT')}
            disabled={loading}
            style={{ flex: 1, padding: '1rem', background: loading ? '#333' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >⬇ Fall</button>
        </div>
      </div>
    </div>
  )
}