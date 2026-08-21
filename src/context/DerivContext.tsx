import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useDerivSocket } from '@/hooks/useDerivSocket'
import {
  getDerivAccounts,
  getDerivWebSocketUrl,
} from '@/lib/deriv'

type AccountType = 'demo' | 'real'

type DerivContextType = {
  status: 'idle' | 'open' | 'closed'
  send: (payload: Record<string, any>) => number | null
  subscribe: (listener: (data: any) => void) => () => void
  balance: number | null
  currency: string
  accountType: AccountType
  setAccountType: (type: AccountType) => void
}

const DerivContext =
  createContext<DerivContextType | null>(null)

export function DerivProvider({
  children,
}: {
  children: ReactNode
}) {
  const [accountType, setAccountTypeState] =
    useState<AccountType>('demo')

  const [wsUrl, setWsUrl] =
    useState<string | null>(null)

  // SINGLE SOURCE OF TRUTH FOR BALANCE
  const [balance, setBalance] =
    useState<number | null>(null)

  const [currency, setCurrency] =
    useState('USD')

  const [token, setToken] =
    useState<string | null>(null)

  // Read Deriv token
  useEffect(() => {
    const storedToken =
      localStorage.getItem('deriv_token')

    if (!storedToken) {
      window.location.href = '/login'
      return
    }

    setToken(storedToken)
  }, [])

  const {
    status,
    send,
    subscribe,
  } = useDerivSocket(wsUrl)

  /*
   * Account switcher.
   *
   * Important:
   * Clear the old balance immediately so the
   * Demo balance cannot temporarily appear
   * while Real is connecting, or vice versa.
   */
  const setAccountType = (type: AccountType) => {
    if (type === accountType) return

    setBalance(null)
    setCurrency('USD')
    setWsUrl(null)

    setAccountTypeState(type)
  }

  /*
   * Connect to the selected Deriv account.
   */
  useEffect(() => {
    if (!token) return

    let cancelled = false

    const connect = async () => {
      try {
        const accs =
          await getDerivAccounts(token)

        if (!accs || accs.length === 0) {
          localStorage.removeItem(
            'deriv_token'
          )
          window.location.href = '/login'
          return
        }

        const acc =
          accs.find(
            (a: any) =>
              a.account_type === accountType
          ) || accs[0]

        const url =
          await getDerivWebSocketUrl(
            acc.account_id,
            token,
            accountType
          )

        if (!url) {
          localStorage.removeItem(
            'deriv_token'
          )
          window.location.href = '/login'
          return
        }

        if (!cancelled) {
          setWsUrl(url)
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(
            'deriv_token'
          )
          window.location.href = '/login'
        }
      }
    }

    connect()

    const interval =
      setInterval(connect, 50000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [token, accountType])

  /*
   * ONE shared balance subscription.
   *
   * Every page using useDeriv() receives
   * this same balance.
   */
  useEffect(() => {
    if (status !== 'open') return

    const unsub = subscribe((data) => {
      if (
        data.msg_type === 'balance' &&
        data.balance
      ) {
        setBalance(
          Number(data.balance.balance)
        )

        if (data.balance.currency) {
          setCurrency(
            data.balance.currency
          )
        }
      }
    })

    send({
      balance: 1,
      subscribe: 1,
    })

    return () => {
      unsub()
    }
  }, [status, send, subscribe])

  return (
    <DerivContext.Provider
      value={{
        status,
        send,
        subscribe,
        balance,
        currency,
        accountType,
        setAccountType,
      }}
    >
      {children}
    </DerivContext.Provider>
  )
}

export function useDeriv() {
  const ctx =
    useContext(DerivContext)

  if (!ctx) {
    throw new Error(
      'useDeriv must be used within DerivProvider'
    )
  }

  return ctx
}