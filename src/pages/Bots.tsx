import { useState, useEffect, useRef } from 'react'
import NavBar from '@/components/NavBar'
import { useDeriv } from '@/context/DerivContext'

type TradeLog = {
  id: number
  type: string
  stake: number
  result: 'won' | 'lost'
  profit: number
}

export default function Bots() {
  const [activeBot, setActiveBot] = useState<'ou' | 'eo'>('ou')
  const [botRunning, setBotRunning] = useState(false)
  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([])
  const [currentStake, setCurrentStake] = useState<number>(0)
  const [botMessage, setBotMessage] = useState('')
  const [market, setMarket] = useState('R_100')
  const [totalPnL, setTotalPnL] = useState(0)
  const tradeIdRef = useRef(0)
  const pendingTradeRef = useRef(false)
  const totalPnLRef = useRef(0)
  const pendingLabelRef = useRef('')
  const pendingStakeRef = useRef(0)
  const activeContractIdRef = useRef<number | null>(null)

  // OU Bot settings
  const [ouDirection, setOuDirection] = useState<'over' | 'under'>('over')
  const [ouDigit1, setOuDigit1] = useState('1')
  const [ouDigit2, setOuDigit2] = useState('3')
  const [ouStake, setOuStake] = useState('1')
  const [ouStopLoss, setOuStopLoss] = useState('10')
  const [ouTakeProfit, setOuTakeProfit] = useState('10')

  // EO Bot settings
  const [eoPrediction, setEoPrediction] = useState<'even' | 'odd'>('even')
  const [eoStake, setEoStake] = useState('1')
  const [eoStopLoss, setEoStopLoss] = useState('10')
  const [eoTakeProfit, setEoTakeProfit] = useState('10')

  const botStateRef = useRef({
    running: false,
    inRecovery: false,
    currentStake: 1,
    startingStake: 1,
    direction: 'over' as string,
    digit1: '1',
    digit2: '3',
    currentDigit: '1',
    eoPrediction: 'even' as string,
    stopLoss: 10,
    takeProfit: 10,
    startingBalance: 0,
    activeBot: 'ou' as 'ou' | 'eo',
    market: 'R_100',
  })

  const { status, balance, currency, accountType, setAccountType, send, subscribe } = useDeriv()

  // Speed: 1s indices trade faster (shorter delay), others slightly slower
  const getDelay = (mkt: string) => mkt.includes('1HZ') ? 300 : 700

  useEffect(() => {
    if (status !== 'open') return

    if (botStateRef.current.running && !pendingTradeRef.current) {
      setTimeout(() => placeNextTrade(), 1000)
    }

    const unsub = subscribe((data) => {
      if (data.msg_type === 'balance') {
        const state = botStateRef.current
        if (state.running && state.startingBalance > 0) {
          const diff = data.balance.balance - state.startingBalance
          if (diff <= -state.stopLoss) {
            stopBot('🛑 Stop Loss reached!')
            return
          }
          if (diff >= state.takeProfit) {
            stopBot('🎯 Take Profit reached!')
            return
          }
        }
      }

      if (data.msg_type === 'proposal') {
        if (!botStateRef.current.running) return
        if (data.error) {
          pendingTradeRef.current = false
          setTimeout(() => {
            if (botStateRef.current.running) placeNextTrade()
          }, 2000)
          return
        }
        send({ buy: data.proposal.id, price: botStateRef.current.currentStake })
      }

      if (data.msg_type === 'buy') {
        if (data.error) {
          pendingTradeRef.current = false
          setTimeout(() => {
            if (botStateRef.current.running) placeNextTrade()
          }, 2000)
          return
        }
        const contractId = data.buy.contract_id
        activeContractIdRef.current = contractId
        const state = botStateRef.current

        let label = ''
        if (state.activeBot === 'ou') {
          label = `${state.direction.toUpperCase()} ${state.currentDigit}`
        } else {
          label = state.eoPrediction.toUpperCase()
        }
        pendingLabelRef.current = label
        pendingStakeRef.current = state.currentStake

        send({ proposal_open_contract: 1, subscribe: 1, contract_id: contractId })
      }

      if (data.msg_type === 'proposal_open_contract') {
        const contract = data.proposal_open_contract
        if (contract.contract_id !== activeContractIdRef.current) return
        if (contract.status !== 'won' && contract.status !== 'lost') return
        if (!botStateRef.current.running) return

        const won = contract.status === 'won'
        const profit = won ? parseFloat(contract.profit) : -parseFloat(contract.buy_price)
        pendingTradeRef.current = false

        const logId = ++tradeIdRef.current
        setTradeLogs(prev => [{
          id: logId,
          type: pendingLabelRef.current,
          stake: pendingStakeRef.current,
          result: won ? 'won' : 'lost',
          profit,
        }, ...prev])

        totalPnLRef.current = totalPnLRef.current + profit
        setTotalPnL(totalPnLRef.current)
        send({ balance: 1 })

        if (won) {
          if (botStateRef.current.inRecovery && totalPnLRef.current < 0) {
            handleLoss()
          } else {
            resetBotState()
            setTimeout(() => placeNextTrade(), getDelay(botStateRef.current.market))
          }
        } else {
          handleLoss()
        }
      }
    })

    return () => { unsub() }
  }, [status])

  const resetBotState = () => {
    const state = botStateRef.current
    state.inRecovery = false
    state.currentStake = state.startingStake
    state.currentDigit = state.digit1
    setCurrentStake(state.startingStake)
  }

  const handleLoss = () => {
    const state = botStateRef.current

    if (state.activeBot === 'ou') {
      if (!state.inRecovery) {
        // First loss — switch to digit2, same stake, same direction
        state.inRecovery = true
        state.currentDigit = state.digit2
      } else {
        // Already in recovery — multiply stake by 1.5, keep digit2
        state.currentStake = parseFloat((state.currentStake * 1.5).toFixed(2))
      }
    } else {
      // EO bot — no flipping, just increase stake by 1.5x, same prediction
      state.inRecovery = true
      state.currentStake = parseFloat((state.currentStake * 1.5).toFixed(2))
    }

    setCurrentStake(state.currentStake)
    setTimeout(() => placeNextTrade(), getDelay(state.market))
  }

  const placeNextTrade = () => {
    if (!botStateRef.current.running) return
    if (pendingTradeRef.current) return
    const state = botStateRef.current

    pendingTradeRef.current = true

    setTimeout(() => {
      if (pendingTradeRef.current) {
        pendingTradeRef.current = false
        if (botStateRef.current.running) {
          placeNextTrade()
        }
      }
    }, 30000)

    let contractType = ''
    let barrier = undefined

    if (state.activeBot === 'ou') {
      contractType = state.direction === 'over' ? 'DIGITOVER' : 'DIGITUNDER'
      barrier = state.currentDigit
    } else {
      contractType = state.eoPrediction === 'even' ? 'DIGITEVEN' : 'DIGITODD'
    }

    const payload: any = {
      proposal: 1,
      amount: state.currentStake,
      basis: 'stake',
      contract_type: contractType,
      currency: 'USD',
      duration: 1,
      duration_unit: 't',
      underlying_symbol: state.market,
      subscribe: 1,
    }

    if (barrier !== undefined) {
      payload.barrier = barrier
    }

    send(payload)
  }

  const startBot = () => {
    if (status !== 'open') {
      setBotMessage('WebSocket not connected!')
      return
    }

    const state = botStateRef.current
    state.running = true
    state.inRecovery = false
    state.activeBot = activeBot
    state.market = market

    if (activeBot === 'ou') {
      state.startingStake = parseFloat(ouStake)
      state.currentStake = parseFloat(ouStake)
      state.direction = ouDirection
      state.digit1 = ouDigit1
      state.digit2 = ouDigit2
      state.currentDigit = ouDigit1
      state.stopLoss = parseFloat(ouStopLoss)
      state.takeProfit = parseFloat(ouTakeProfit)
    } else {
      state.startingStake = parseFloat(eoStake)
      state.currentStake = parseFloat(eoStake)
      state.eoPrediction = eoPrediction
      state.stopLoss = parseFloat(eoStopLoss)
      state.takeProfit = parseFloat(eoTakeProfit)
    }

    state.startingBalance = balance || 0
    totalPnLRef.current = 0
    pendingTradeRef.current = false
    setBotRunning(true)
    setCurrentStake(state.currentStake)
    setBotMessage('🤖 Bot started!')
    setTradeLogs([])
    setTotalPnL(0)
    placeNextTrade()
  }

  const stopBot = (reason?: string) => {
    botStateRef.current.running = false
    botStateRef.current.startingBalance = 0
    botStateRef.current.inRecovery = false
    pendingTradeRef.current = false
    setBotRunning(false)
    setBotMessage(reason || '⏹ Bot stopped')
  }

  const resetBot = () => {
    botStateRef.current.running = false
    botStateRef.current.startingBalance = 0
    botStateRef.current.inRecovery = false
    pendingTradeRef.current = false
    totalPnLRef.current = 0
    setBotRunning(false)
    setTradeLogs([])
    setCurrentStake(0)
    setBotMessage('')
    setTotalPnL(0)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: '#0a0a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    marginBottom: '1rem',
    boxSizing: 'border-box' as const
  }

  const labelStyle = { color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>⚡ Swift Trade</h1>
        <button onClick={() => { localStorage.removeItem('deriv_token'); window.location.href = '/login' }}
          style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          Logout</button>
      </div>

      <NavBar />

      {/* Account Toggle */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => setAccountType('demo')}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: accountType === 'demo' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}>
            Demo</button>
          <button onClick={() => setAccountType('real')}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: accountType === 'real' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}>
            Real</button>
        </div>
        <p style={{ color: '#aaa', margin: 0 }}>{accountType === 'demo' ? 'Demo' : 'Real'} Account · {currency}</p>
        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2rem' }}>
          {balance !== null ? `${balance.toFixed(2)}` : status === 'open' ? 'Loading...' : 'Connecting...'}
        </h2>
      </div>

      {/* Market Selector */}
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={labelStyle}>Market</p>
        <select value={market} onChange={e => setMarket(e.target.value)}
          style={{ ...inputStyle, marginBottom: 0 }}>
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
      </div>

      {/* Bot Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveBot('ou')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: activeBot === 'ou' ? '#6c63ff' : '#1a1a2e', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
          Wealth Generator OU</button>
        <button onClick={() => setActiveBot('eo')}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: activeBot === 'eo' ? '#6c63ff' : '#1a1a2e', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
          Wealth Generator EO</button>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

        {/* Bot Settings */}
        <div style={{ flex: 1, background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem' }}>
          {activeBot === 'ou' ? (
            <>
              <h3 style={{ color: '#6c63ff', margin: '0 0 1rem' }}>🤖 Wealth Generator OU</h3>
              <p style={labelStyle}>Direction</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => setOuDirection('over')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: ouDirection === 'over' ? '#22c55e' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}>
                  Over</button>
                <button onClick={() => setOuDirection('under')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: ouDirection === 'under' ? '#ef4444' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}>
                  Under</button>
              </div>
              <p style={labelStyle}>First Digit (0-9)</p>
              <select value={ouDigit1} onChange={e => setOuDigit1(e.target.value)} style={inputStyle}>
                {[0,1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <p style={labelStyle}>Second Digit (0-9)</p>
              <select value={ouDigit2} onChange={e => setOuDigit2(e.target.value)} style={inputStyle}>
                {[0,1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <p style={labelStyle}>Starting Stake (USD)</p>
              <input type="number" value={ouStake} onChange={e => setOuStake(e.target.value)} style={inputStyle} />
              <p style={labelStyle}>Stop Loss (USD)</p>
              <input type="number" value={ouStopLoss} onChange={e => setOuStopLoss(e.target.value)} style={inputStyle} />
              <p style={labelStyle}>Take Profit (USD)</p>
              <input type="number" value={ouTakeProfit} onChange={e => setOuTakeProfit(e.target.value)} style={inputStyle} />
            </>
          ) : (
            <>
              <h3 style={{ color: '#6c63ff', margin: '0 0 1rem' }}>🤖 Wealth Generator EO</h3>
              <p style={labelStyle}>Prediction</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => setEoPrediction('even')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: eoPrediction === 'even' ? '#6c63ff' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}>
                  Even</button>
                <button onClick={() => setEoPrediction('odd')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: eoPrediction === 'odd' ? '#f59e0b' : '#0a0a1a', color: '#fff', cursor: 'pointer' }}>
                  Odd</button>
              </div>
              <p style={labelStyle}>Starting Stake (USD)</p>
              <input type="number" value={eoStake} onChange={e => setEoStake(e.target.value)} style={inputStyle} />
              <p style={labelStyle}>Stop Loss (USD)</p>
              <input type="number" value={eoStopLoss} onChange={e => setEoStopLoss(e.target.value)} style={inputStyle} />
              <p style={labelStyle}>Take Profit (USD)</p>
              <input type="number" value={eoTakeProfit} onChange={e => setEoTakeProfit(e.target.value)} style={inputStyle} />
            </>
          )}

          {botRunning && (
            <div style={{ background: '#0a0a1a', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ color: '#aaa', margin: '0 0 0.25rem', fontSize: '0.8rem' }}>CURRENT STAKE</p>
              <h2 style={{ margin: 0, color: '#6c63ff' }}>${currentStake.toFixed(2)}</h2>
            </div>
          )}

          {botMessage && (
            <p style={{ color: botMessage.includes('Error') || botMessage.includes('Stop') ? '#ef4444' : botMessage.includes('Take') ? '#22c55e' : '#6c63ff', marginBottom: '1rem', fontWeight: 'bold' }}>
              {botMessage}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!botRunning ? (
              <button onClick={startBot}
                style={{ flex: 2, padding: '1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                ▶ Start Bot</button>
            ) : (
              <button onClick={() => stopBot()}
                style={{ flex: 2, padding: '1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                ⏹ Stop Bot</button>
            )}
            <button onClick={resetBot}
              style={{ flex: 1, padding: '1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
              🔄</button>
          </div>
        </div>

        {/* Trade Log */}
        <div style={{ flex: 1, background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
          <h3 style={{ color: '#aaa', margin: '0 0 1rem', fontSize: '0.9rem' }}>TRADE LOG</h3>
          {tradeLogs.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center', marginTop: '2rem' }}>No trades yet</p>
          ) : (
            <>
              {tradeLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #0a0a1a' }}>
                  <span style={{ color: '#fff', fontSize: '0.85rem' }}>{log.type} · ${log.stake.toFixed(2)}</span>
                  <span style={{ color: log.result === 'won' ? '#22c55e' : '#ef4444', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {log.result === 'won' ? `+${log.profit.toFixed(2)}` : `${log.profit.toFixed(2)}`}
                  </span>
                </div>
              ))}

              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#0a0a1a', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Total P&L</span>
                  <span style={{ color: totalPnL >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}