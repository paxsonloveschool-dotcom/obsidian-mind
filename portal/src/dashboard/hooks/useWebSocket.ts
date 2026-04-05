import { useEffect, useRef, useState, useCallback } from "react";
import type { WSMessage } from "../../shared/types";

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const listenersRef = useRef<Set<(msg: WSMessage) => void>>(new Set());

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        const msg: WSMessage = JSON.parse(event.data);
        setLastMessage(msg);
        for (const listener of listenersRef.current) {
          listener(msg);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();
    return () => wsRef.current?.close();
  }, [url]);

  const subscribe = useCallback((listener: (msg: WSMessage) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  return { connected, lastMessage, subscribe };
}
