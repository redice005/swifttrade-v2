import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useDerivSocket } from '@/hooks/useDerivSocket'
import { getDerivAccounts, getDerivWebSocketUrl } from '@/lib/deriv'

// Your Deriv account IDs — only these accounts get the balance visibility control.
const ADMIN_ACCOUNT_IDS = ['DOT92452526', 'ROT91269698'] // demo, real

type BalanceVisibility = 'visible' | 'hidden'

type DerivContextType = {
  status: 'idle' | 'open' | 'closed'
  send: (payload: Record<string, any>) => number | null
  subscribe: (listener: (data: any) => void) => () => void
  balance: number | null
  currency: string
  accountType: 'demo' | 'real'
  setAccountType: (type: 'demo' | 'real') => void
  isAdmin: boolean
  balanceVisibility: BalanceVisibility
  setBalanceVisibility: (v: BalanceVisibility) => void
}

const DerivContext = createContext<DerivContextType | null>(null)

export function DerivProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo')
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [token, setToken] = useState<string | null>(null)
  const [loginid, setLoginid] = useState<string | null>(null)

  const isAdmin = loginid !== null && ADMIN_ACCOUNT_IDS.includes(loginid)

  // Per-account, persisted, defaults to 'visible'. Non-admins never read/write this
  // (the control isn't rendered for them), so it has no effect on other users.
  const [balanceVisibility, setBalanceVisibilityState] = useState<BalanceVisibility>('visible')

  useEffect(() => {
    if (!loginid) return
    const stored = localStorage.getItem(`balance_visibility_${loginid}`)
    if (stored === 'hidden' || stored === 'visible') {
      setBalanceVisibilityState(stored)
    }
  }, [loginid])

  const setBalanceVisibility = (v: BalanceVisibility) => {
    setBalanceVisibilityState(v)
    if (loginid) {
      localStorage.setItem(`balance_visibility_${loginid}`, v)
    }
  }

  // Read token reactively — not just once at mount
  useEffect(() => {
    const t = localStorage.getItem('deriv_token')
    if (!t) {
      window.location.href = '/login'
      return
    }
    setToken(t)
  }, [])

  const { status, send, subscribe } = useDerivSocket(wsUrl)

  useEffect(() => {
    if (!token) return

    // Clear stale balance immediately when switching accounts
    // so the UI shows a loading state instead of the old account's number
    setBalance(null)

    const connect = async () => {
      try {
        const accs = await getDerivAccounts(token)
        if (!accs || accs.length === 0) {
          localStorage.removeItem('deriv_token')
          window.location.href = '/login'
          return
        }
        const acc = accs.find((a: any) => a.account_type === accountType) || accs[0]
        setLoginid(acc.account_id)
        const url = await getDerivWebSocketUrl(acc.account_id, token, accountType)
        if (!url) {
          localStorage.removeItem('deriv_token')
          window.location.href = '/login'
          return
        }
        setWsUrl(url)
      } catch {
        localStorage.removeItem('deriv_token')
        window.location.href = '/login'
      }
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
    <DerivContext.Provider value={{
      status, send, subscribe, balance, currency, accountType, setAccountType,
      isAdmin, balanceVisibility, setBalanceVisibility,
    }}>
      {children}
    </DerivContext.Provider>
  )
}

export function useDeriv() {
  const ctx = useContext(DerivContext)
  if (!ctx) throw new Error('useDeriv must be used within DerivProvider')
  return ctx
}
