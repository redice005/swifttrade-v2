import { useEffect, useRef, useState, useCallback } from "react";
import { DERIV_WS_URL } from "@/lib/deriv";

type Listener = (data: any) => void;

export function useDerivSocket(token?: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<Listener>>(new Set());
  const reqIdRef = useRef(1);
  const [status, setStatus] = useState<"idle" | "open" | "closed">("idle");

  useEffect(() => {
    setStatus("idle");
    const ws = new WebSocket(DERIV_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
      if (token) {
        ws.send(JSON.stringify({ authorize: token, req_id: reqIdRef.current++ }));
      }
    };

    ws.onclose = () => {
      if (wsRef.current === ws) setStatus("closed");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
console.log('WS:', data.msg_type, data);
listenersRef.current.forEach((l) => l(data));
      } catch {
        // ignore
      }
    };

    return () => {
      if (wsRef.current === ws) wsRef.current = null;
      ws.close();
    };
  }, [token]);

  const send = useCallback((payload: Record<string, any>) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return null;
    const req_id = reqIdRef.current++;
    ws.send(JSON.stringify({ ...payload, req_id }));
    return req_id;
  }, []);

  const subscribe = useCallback((listener: Listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  return { status, send, subscribe };
}