import { useEffect, useRef, useState, useCallback } from "react";

type Listener = (data: any) => void;

export function useDerivSocket(wsUrl?: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<Listener>>(new Set());
  const reqIdRef = useRef(1);
  const [status, setStatus] = useState<"idle" | "open" | "closed">("idle");

  useEffect(() => {
    if (!wsUrl) return;
    
    setStatus("idle");
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
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
  }, [wsUrl]);

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