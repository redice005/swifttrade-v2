import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { useDerivSocket } from '@/hooks/useDerivSocket'
import { getDerivAccounts, getDerivWebSocketUrl } from '@/lib/deriv'

type DerivContextType = {
  status: 'idle' | 'open' | 'closed'
  send: (payload: Record<string, any>) => number | null
  subscribe: (listener: (data: any) => void) => () => void
  balance: number | null
  currency: string
  accountType: 'demo' | 'real'
  setAccountType: (type: 'demo' | 'real') => void
}

const DerivContext = createContext<DerivContextType | null>(null)

export function DerivProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo')
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [currency, setCurrency] = useState('USD')

  const token = localStorage.getItem('deriv_token')
  const { status, send, subscribe } = useDerivSocket(wsUrl)

  useEffect(() => {
  if (!token) return
  const connect = async () => {
    const accs = await getDerivAccounts(token)
    if (!accs || accs.length === 0) {
      // token is invalid/expired — clear it so the user can log in again
      localStorage.removeItem('deriv_token')
      window.location.href = '/login'
      return
    }
    const acc = accs.find((a: any) => a.account_type === accountType) || accs[0]
    const url = await getDerivWebSocketUrl(acc.account_id, token, accountType)
    if (!url) {
      localStorage.removeItem('deriv_token')
      window.location.href = '/login'
      return
    }
    setWsUrl(url)
  }
  connect()
  const interval = setInterval(connect, 50000)
  return () => clearInterval(interval)
}, [token, accountType])

  useEffect(() => {
    if (status !== 'open') return
    const unsub = subscribe((data) => {
      if (data.msg_type === 'balance') {
        setBalance(data.balance.balance)
        setCurrency(data.balance.currency)
      }
    })
    send({ balance: 1, subscribe: 1 })
    return () => { unsub() }
  }, [status])

  return (
    <DerivContext.Provider value={{ status, send, subscribe, balance, currency, accountType, setAccountType }}>
      {children}
    </DerivContext.Provider>
  )
}

export function useDeriv() {
  const ctx = useContext(DerivContext)
  if (!ctx) throw new Error('useDeriv must be used within DerivProvider')
  return ctx
}
