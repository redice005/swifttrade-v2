import { useState, useEffect } from 'react'
import { useDeriv } from '@/context/DerivContext'
import NavBar from '@/components/NavBar'

export default function Dashboard() {
  const { status, balance, currency, accountType, setAccountType, send, subscribe, allAccounts } = useDeriv()
  const [market, setMarket] = useState('R_100')
  const [stake, setStake] = useState('10')
  const [duration, setDuration] = useState('5')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [contractCategory, setContractCategory] = useState('rise_fall')
  const [barrier, setBarrier] = useState('5')
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferDirection, setTransferDirection] = useState<'toOptions' | 'toWallet'>('toOptions')
  const [transferMsg, setTransferMsg] = useState('')
  const [transferring, setTransferring] = useState(false)

  useEffect(() => {
    if (status !== 'open') return
    let activeContractId: number | null = null
    const unsub = subscribe((data) => {
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
          activeContractId = data.buy.contract_id
          send({ proposal_open_contract: 1, subscribe: 1, contract_id: data.buy.contract_id })
        }
      }
      if (data.msg_type === 'proposal_open_contract') {
        const contract = data.proposal_open_contract
        if (contract.contract_id !== activeContractId) return
        if (contract.status === 'won') {
          setMessage(`Won! Profit: +${contract.profit} ${currency}`)
          setLoading(false)
        } else if (contract.status === 'lost') {
          setMessage(`Lost! -${contract.buy_price} ${currency}`)
          setLoading(false)
        }
      }
      if (data.msg_type === 'transfer_between_accounts') {
        setTransferring(false)
        if (data.error) {
          setTransferMsg(`Error: ${data.error.message}`)
        } else {
          setTransferMsg('Transfer successful!')
          setTransferAmount('')
          send({ balance: 1, subscribe: 1 })
          setTimeout(() => {
            setShowTransfer(false)
            setTransferMsg('')
          }, 1500)
        }
      }
    })
    send({ ticks: market, subscribe: 1 })
    return () => { unsub() }
  }, [status, market])

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount)
    if (!amount || amount <= 0) {
      setTransferMsg('Enter a valid amount')
      return
    }

    const walletAcc = allAccounts.find((a: any) =>
      a.account_type === 'wallet' || a.account_category === 'wallet'
    )
    const optionsAcc = allAccounts.find((a: any) =>
      a.account_type === 'trading' || a.account_type === 'options' || a.account_category === 'trading'
    )

    if (!walletAcc || !optionsAcc) {
      setTransferMsg('Could not find accounts. Try again.')
      return
    }

    setTransferring(true)
    setTransferMsg('')

    if (transferDirection === 'toOptions') {
      send({
        transfer_between_accounts: 1,
        account_from: walletAcc.loginid,
        account_to: optionsAcc.loginid,
        amount,
        currency: 'USD',
      })
    } else {
      send({
        transfer_between_accounts: 1,
        account_from: optionsAcc.loginid,
        account_to: walletAcc.loginid,
        amount,
        currency: 'USD',
      })
    }
  }

  const placeContract = (type: string) => {
    if (!send) return
    setLoading(true)
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
    send(payload)
  }

  const logout = () => {
    localStorage.removeItem('deriv_token')
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>Swift Trade</h1>
        <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
      <NavBar />

      {/* Balance Card */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button onClick={() => setAccountType('demo')}
            style={{ flex: 1, padding: '0.35rem', borderRadius: '8px', border: 'none', background: accountType === 'demo' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
            Demo</button>
          <button onClick={() => setAccountType('real')}
            style={{ flex: 1, padding: '0.35rem', borderRadius: '8px', border: 'none', background: accountType === 'real' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
            Real</button>
        </div>
        <p style={{ color: '#aaa', margin: 0, fontSize: '0.8rem' }}>{accountType === 'demo' ? 'Demo' : 'Real'} Account · {currency}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.3rem' }}>
            {balance !== null ? `${balance.toFixed(2)}` : status === 'open' ? 'Loading...' : 'Connecting...'}
          </h2>
          {accountType === 'real' && (
            <button
              onClick={() => { setShowTransfer(true); setTransferMsg(''); setTransferAmount('') }}
              style={{ background: 'rgba(108, 99, 255, 0.15)', color: '#6c63ff', border: '1px solid #6c63ff', padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.25rem' }}
            >
              Transfer
            </button>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransfer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '380px', border: '1px solid rgba(108,99,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Transfer Funds</h3>
              <button onClick={() => setShowTransfer(false)}
                style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>X</button>
            </div>

            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0 0 0.75rem' }}>Direction</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setTransferDirection('toOptions')}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: transferDirection === 'toOptions' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                Wallet → Options
              </button>
              <button
                onClick={() => setTransferDirection('toWallet')}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: transferDirection === 'toWallet' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                Options → Wallet
              </button>
            </div>

            <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>Amount (USD)</p>
            <input
              type="number"
              placeholder="0.00"
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' }}
            />

            {transferMsg && (
              <p style={{ color: transferMsg.includes('Error') ? '#ef4444' : '#22c55e', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                {transferMsg}
              </p>
            )}

            <button
              onClick={handleTransfer}
              disabled={transferring}
              style={{ width: '100%', padding: '0.85rem', background: transferring ? '#333' : 'linear-gradient(135deg, #6c63ff, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: transferring ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
              {transferring ? 'Transferring...' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      )}

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
        <input type="number" value={duration} min="1" max="5" onChange={e => setDuration(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', background: '#0a0a1a', color: '#fff', border: 'none', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box' }} />

        {message && (
          <p style={{ color: message.includes('Error') ? 'red' : message.includes('Won') ? '#22c55e' : '#ef4444', marginBottom: '1rem', fontWeight: 'bold' }}>
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