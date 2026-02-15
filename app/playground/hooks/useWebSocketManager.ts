/**
 * Hook that manages the full WebSocket lifecycle for the playground.
 *
 * Handles connecting to the proxy, sending subscribe/unsubscribe messages,
 * dispatching incoming notifications to the event log, and auto-reconnecting
 * with exponential back-off on unexpected disconnects.
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { ConnectionStatus, SubscriptionStatus, LogEvent } from "../lib/types";
import { buildUnsubscribeRequest } from "../lib/buildRequest";

const WS_PROXY_URL = process.env.NEXT_PUBLIC_WS_PROXY_URL ?? "ws://localhost:3001";

/** Return value of {@link useWebSocketManager}. */
interface UseWebSocketManagerReturn {
  /** Current WebSocket connection state. */
  connectionStatus: ConnectionStatus;
  /** Current subscription lifecycle state. */
  subscriptionStatus: SubscriptionStatus;
  /** Ordered list of log events (sent, received, error, info). */
  events: LogEvent[];
  /** The last subscribe request object sent to the proxy, or `null`. */
  sentRequest: object | null;
  /** Open a WebSocket connection and send the given subscribe request. */
  connect: (request: object) => void;
  /** Unsubscribe (if active) and close the WebSocket connection. */
  disconnect: () => void;
  /** Clear all entries from the event log. */
  clearLogs: () => void;
}

let eventIdCounter = 0;

/** Create a timestamped {@link LogEvent} with a monotonically increasing ID. */
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
  const subscriptionIdRef = useRef<string | null>(null);
  const connectInternalRef = useRef<(request: object) => void>(() => {});

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
      if (pendingRequestRef.current) {
        connectInternalRef.current(pendingRequestRef.current);
      }
    }, delay);
  }, [addEvent]);

  const connectInternal = useCallback(
    (request: object) => {
      cleanupSocket();
      setConnectionStatus("connecting");

      const url = `${WS_PROXY_URL}/ws`;
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        reconnectAttemptRef.current = 0;
        addEvent("info", "Connected to proxy");

        setSubscriptionStatus("subscribing");
        const reqStr = JSON.stringify(request);
        ws.send(reqStr);
        addEvent("sent", reqStr);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          // Proxy subscribe confirmation: { type: "subscribed", subscriptionId, method }
          if (msg.type === "subscribed" && msg.subscriptionId) {
            subscriptionIdRef.current = msg.subscriptionId;
            setSubscriptionStatus("active");
            addEvent("info", `Subscription confirmed (id: ${msg.subscriptionId})`);
            return;
          }

          // Proxy unsubscribe confirmation: { type: "unsubscribed", subscriptionId }
          if (msg.type === "unsubscribed") {
            subscriptionIdRef.current = null;
            setSubscriptionStatus("idle");
            addEvent("info", "Unsubscribed successfully");
            return;
          }

          // Proxy error: { type: "error", message }
          if (msg.type === "error") {
            setSubscriptionStatus("error");
            addEvent("error", msg.message ?? JSON.stringify(msg));
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

  /** Open a new connection to the proxy and send the subscribe request. */
  const connect = useCallback(
    (request: object) => {
      intentionalCloseRef.current = false;
      pendingRequestRef.current = request;
      setSentRequest(request);
      connectInternal(request);
    },
    [connectInternal]
  );

  /** Send an unsubscribe message (if subscribed) and close the socket. */
  const disconnect = useCallback(() => {
    // Send unsubscribe before closing if we have an active subscription
    if (subscriptionIdRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
      const unsub = buildUnsubscribeRequest(subscriptionIdRef.current);
      socketRef.current.send(JSON.stringify(unsub));
    }
    intentionalCloseRef.current = true;
    subscriptionIdRef.current = null;
    cleanupSocket();
    setConnectionStatus("disconnected");
    setSubscriptionStatus("idle");
    addEvent("info", "Disconnected");
  }, [cleanupSocket, addEvent]);

  /** Remove all entries from the event log. */
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
