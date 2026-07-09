import { createContext, useContext, useRef, useState, ReactNode } from 'react'

// Market pool: V10, V25, V75, V100 and their 1s variants
const MARKETS = [
  { code: 'R_10', label: 'Volatility 10' },
  { code: 'R_25', label: 'Volatility 25' },
  { code: 'R_75', label: 'Volatility 75' },
  { code: 'R_100', label: 'Volatility 100' },
  { code: '1HZ10V', label: 'Volatility 10 (1s)' },
  { code: '1HZ25V', label: 'Volatility 25 (1s)' },
  { code: '1HZ75V', label: 'Volatility 75 (1s)' },
  { code: '1HZ100V', label: 'Volatility 100 (1s)' },
]

type Direction = 'Over' | 'Under'

interface Recommendation {
  market: { code: string; label: string }
  direction: Direction
  firstDigit: number
  recoveryDigit: number
}

// Fixed digit pairs - not derived from real analysis, just a placeholder
// rule for demoing the UI flow.
const DIRECTION_RULES: Record<Direction, { first: number; recovery: number }> = {
  Over: { first: 1, recovery: 3 },
  Under: { first: 8, recovery: 6 },
}

function pickRandomRecommendation(): Recommendation {
  const market = MARKETS[Math.floor(Math.random() * MARKETS.length)]
  const direction: Direction = Math.random() < 0.5 ? 'Over' : 'Under'
  const rule = DIRECTION_RULES[direction]
  return {
    market,
    direction,
    firstDigit: rule.first,
    recoveryDigit: rule.recovery,
  }
}

const SCAN_DURATION_MS = 10000
const COOLDOWN_SECONDS = 120

interface AiScannerContextValue {
  scanning: boolean
  result: Recommendation | null
  cooldown: number
  runScan: () => void
}

const AiScannerContext = createContext<AiScannerContextValue | null>(null)

export function AiScannerProvider({ children }: { children: ReactNode }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<Recommendation | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const runScan = () => {
    if (cooldown > 0 || scanning) return
    setResult(null)
    setScanning(true)
    scanTimeout.current = setTimeout(() => {
      setResult(pickRandomRecommendation())
      setScanning(false)
      setCooldown(COOLDOWN_SECONDS)
      cooldownInterval.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            if (cooldownInterval.current) clearInterval(cooldownInterval.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, SCAN_DURATION_MS)
  }

  return (
    <AiScannerContext.Provider value={{ scanning, result, cooldown, runScan }}>
      {children}
    </AiScannerContext.Provider>
  )
}

export function useAiScanner() {
  const ctx = useContext(AiScannerContext)
  if (!ctx) throw new Error('useAiScanner must be used within AiScannerProvider')
  return ctx
}
