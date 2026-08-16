import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts'
import { useDeriv } from '@/context/DerivContext'

interface CandleChartProps {
  symbol: string
  height?: number
}

export function CandleChart({
  symbol,
  height = 360,
}: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const subscriptionIdRef = useRef<string | null>(null)

  const { status, send, subscribe } = useDeriv()

  // --------------------------------------------------
  // CREATE CHART
  // --------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,

      layout: {
        background: {
          color: 'transparent',
        },
        textColor: '#94a3b8',
      },

      grid: {
        vertLines: {
          color: 'rgba(148,163,184,0.08)',
        },
        horzLines: {
          color: 'rgba(148,163,184,0.08)',
        },
      },

      rightPriceScale: {
        borderColor: 'rgba(148,163,184,0.2)',
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(148,163,184,0.2)',
      },

      crosshair: {
        mode: 1,
      },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#16a34a',
      downColor: '#dc2626',

      borderUpColor: '#16a34a',
      borderDownColor: '#dc2626',

      wickUpColor: '#16a34a',
      wickDownColor: '#dc2626',
    })

    chartRef.current = chart
    seriesRef.current = series

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return

      chart.applyOptions({
        width: containerRef.current.clientWidth,
      })
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()

      chart.remove()

      chartRef.current = null
      seriesRef.current = null
    }
  }, [height])

  // --------------------------------------------------
  // LOAD + SUBSCRIBE TO DERIV CANDLES
  // --------------------------------------------------
  useEffect(() => {
    const series = seriesRef.current

    if (!series) return
    if (status !== 'open') return

    let cancelled = false

    // Clear previous subscription reference
    subscriptionIdRef.current = null

    // Subscribe to messages coming through the existing
    // DerivContext WebSocket.
    const unsubscribe = subscribe((data: any) => {
      if (cancelled) return

      try {
        // ----------------------------------------------
        // INITIAL CANDLE HISTORY
        // ----------------------------------------------
        if (
          data.msg_type === 'candles' &&
          Array.isArray(data.candles)
        ) {
          const candles: CandlestickData[] = data.candles
            .map((c: any) => ({
              time: Number(c.epoch) as Time,
              open: Number(c.open),
              high: Number(c.high),
              low: Number(c.low),
              close: Number(c.close),
            }))
            .filter(
              (c) =>
                Number.isFinite(c.open) &&
                Number.isFinite(c.high) &&
                Number.isFinite(c.low) &&
                Number.isFinite(c.close)
            )

          if (candles.length > 0) {
            series.setData(candles)

            chartRef.current?.timeScale().fitContent()
          }
        }

        // ----------------------------------------------
        // LIVE OHLC UPDATE
        // ----------------------------------------------
        if (
          data.msg_type === 'ohlc' &&
          data.ohlc
        ) {
          const ohlc = data.ohlc

          // Save subscription ID so we can forget it later
          if (data.subscription?.id) {
            subscriptionIdRef.current = data.subscription.id
          }

          series.update({
            time: Number(ohlc.open_time) as Time,
            open: Number(ohlc.open),
            high: Number(ohlc.high),
            low: Number(ohlc.low),
            close: Number(ohlc.close),
          })
        }

        // ----------------------------------------------
        // SOME DERIV RESPONSES INCLUDE SUBSCRIPTION ID
        // ----------------------------------------------
        if (
          data.subscription?.id &&
          (
            data.msg_type === 'candles' ||
            data.msg_type === 'ohlc'
          )
        ) {
          subscriptionIdRef.current = data.subscription.id
        }
      } catch {
        // Ignore malformed Deriv messages
      }
    })

    // ----------------------------------------------
    // REQUEST 200 ONE-MINUTE CANDLES + LIVE UPDATES
    // ----------------------------------------------
    send({
      ticks_history: symbol,
      adjust_start_time: 1,
      count: 200,
      end: 'latest',
      start: 1,
      style: 'candles',
      granularity: 60,
      subscribe: 1,
    })

    // ----------------------------------------------
    // CLEANUP
    // ----------------------------------------------
    return () => {
      cancelled = true

      unsubscribe()

      const subscriptionId = subscriptionIdRef.current

      if (subscriptionId) {
        send({
          forget: subscriptionId,
        })

        subscriptionIdRef.current = null
      }
    }
  }, [symbol, status, send, subscribe])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height,
        position: 'relative',
      }}
    />
  )
}