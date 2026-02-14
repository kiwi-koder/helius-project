import { useState, useRef, useCallback, useEffect } from "react";
import { ConnectionStatus, SubscriptionStatus, LogEvent } from "../lib/types";

interface UseWebSocketManagerReturn {
  connectionStatus: ConnectionStatus;
  subscriptionStatus: SubscriptionStatus;
  events: LogEvent[];
  sentRequest: object | null;
  connect: (url: string, request: object) => void;
  disconnect: () => void;
  clearLogs: () => void;
}

let eventIdCounter = 0;

function createEvent(type: LogEvent["type"], data: string): LogEvent {
  return {
    id: String(++eventIdCounter),
    timestamp: new Date(),
    type,
    data,
  };
}

export function useWebSocketManager(): UseWebSocketManagerReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("idle");
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [sentRequest, setSentRequest] = useState<object | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const intentionalCloseRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const pendingRequestRef = useRef<object | null>(null);
  const pendingUrlRef = useRef<string>("");
  const subscriptionIdRef = useRef<number | null>(null);
  const connectInternalRef = useRef<(url: string, request: object) => void>(() => {});

  const addEvent = useCallback((type: LogEvent["type"], data: string) => {
    setEvents((prev) => [...prev, createEvent(type, data)]);
  }, []);

  const cleanupSocket = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
      socketRef.current.onerror = null;
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    const attempt = reconnectAttemptRef.current;
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    reconnectAttemptRef.current = attempt + 1;

    addEvent("info", `Reconnecting in ${delay / 1000}s...`);

    reconnectTimerRef.current = setTimeout(() => {
      if (pendingUrlRef.current && pendingRequestRef.current) {
        connectInternalRef.current(pendingUrlRef.current, pendingRequestRef.current);
      }
    }, delay);
  }, [addEvent]);

  const connectInternal = useCallback(
    (url: string, request: object) => {
      cleanupSocket();
      setConnectionStatus("connecting");

      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        reconnectAttemptRef.current = 0;
        addEvent("info", "WebSocket connected");

        setSubscriptionStatus("subscribing");
        const reqStr = JSON.stringify(request);
        ws.send(reqStr);
        addEvent("sent", reqStr);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          // Subscription confirmation: result is a number (subscription ID)
          if (typeof msg.result === "number" && msg.id !== undefined) {
            subscriptionIdRef.current = msg.result;
            setSubscriptionStatus("active");
            addEvent("info", `Subscription confirmed (id: ${msg.result})`);
            return;
          }

          // Unsubscribe confirmation
          if (msg.result === true && msg.id !== undefined) {
            subscriptionIdRef.current = null;
            setSubscriptionStatus("idle");
            addEvent("info", "Unsubscribed successfully");
            return;
          }

          // Error response
          if (msg.error) {
            setSubscriptionStatus("error");
            addEvent("error", JSON.stringify(msg.error));
            return;
          }

          // Notification (method ends with "Notification")
          if (msg.method && msg.method.endsWith("Notification")) {
            addEvent("received", JSON.stringify(msg));
            return;
          }

          // Fallback
          addEvent("received", JSON.stringify(msg));
        } catch {
          addEvent("received", event.data);
        }
      };

      ws.onerror = () => {
        addEvent("error", "WebSocket error");
        setConnectionStatus("error");
      };

      ws.onclose = (event) => {
        setConnectionStatus("disconnected");
        if (!intentionalCloseRef.current) {
          addEvent("info", `Connection closed (code: ${event.code})`);
          setSubscriptionStatus("idle");
          scheduleReconnect();
        } else {
          addEvent("info", "Connection closed");
        }
      };
    },
    [cleanupSocket, addEvent, scheduleReconnect]
  );

  useEffect(() => {
    connectInternalRef.current = connectInternal;
  }, [connectInternal]);

  const connect = useCallback(
    (url: string, request: object) => {
      intentionalCloseRef.current = false;
      pendingUrlRef.current = url;
      pendingRequestRef.current = request;
      setSentRequest(request);
      connectInternal(url, request);
    },
    [connectInternal]
  );

  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;
    subscriptionIdRef.current = null;
    cleanupSocket();
    setConnectionStatus("disconnected");
    setSubscriptionStatus("idle");
    addEvent("info", "Disconnected");
  }, [cleanupSocket, addEvent]);

  const clearLogs = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    connectionStatus,
    subscriptionStatus,
    events,
    sentRequest,
    connect,
    disconnect,
    clearLogs,
  };
}
