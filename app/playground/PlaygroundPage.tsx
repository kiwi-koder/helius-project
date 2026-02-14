"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { FormState, ValidationErrors, Filter, SubscriptionMethod, ProgramSubscribeForm } from "./lib/types";
import { buildRequest } from "./lib/buildRequest";
import { useWebSocketManager } from "./hooks/useWebSocketManager";
import Header from "./components/Header";
import WebSocketUrlInput from "./components/WebSocketUrlInput";
import MethodTabs from "./components/MethodTabs";
import RequestBuilderCard from "./components/RequestBuilderCard";
import SubscribeButton from "./components/SubscribeButton";
import StatusBar from "./components/StatusBar";
import LogsPanel from "./components/LogsPanel";

const DEFAULT_PROGRAM_SUBSCRIBE: ProgramSubscribeForm = {
  programId: "",
  commitment: "confirmed",
  encoding: "base64",
  filters: [],
};

const DEFAULT_FORM: FormState = {
  method: "programSubscribe",
  programSubscribe: DEFAULT_PROGRAM_SUBSCRIBE,
};

function validateUrl(url: string): string | undefined {
  if (!url.trim()) return "URL is required";
  if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
    return "URL must start with ws:// or wss://";
  }
  return undefined;
}

function validateProgramId(id: string): string | undefined {
  if (!id.trim()) return "Program ID is required";
  return undefined;
}

function validateFilters(filters: Filter[]): Record<number, string> {
  const errors: Record<number, string> = {};
  filters.forEach((f, i) => {
    if (f.type === "dataSize") {
      const n = parseInt(f.value, 10);
      if (!f.value.trim() || isNaN(n) || n <= 0 || !Number.isInteger(n)) {
        errors[i] = "Must be a positive integer";
      }
    } else {
      const offset = parseInt(f.offset, 10);
      if (!f.offset.trim() || isNaN(offset) || offset < 0 || !Number.isInteger(offset)) {
        errors[i] = "Offset must be a non-negative integer";
      } else if (!f.bytes.trim()) {
        errors[i] = "Bytes value is required";
      }
    }
  });
  return errors;
}

function validateForm(form: FormState): { programId?: string; filters: Record<number, string> } {
  switch (form.method) {
    case "programSubscribe": {
      const ps = form.programSubscribe;
      return {
        programId: validateProgramId(ps.programId),
        filters: validateFilters(ps.filters),
      };
    }
    default:
      return { filters: {} };
  }
}

export default function PlaygroundPage() {
  const [wsUrl, setWsUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("helius-ws-url") || "";
    }
    return "";
  });

  useEffect(() => {
    localStorage.setItem("helius-ws-url", wsUrl);
  }, [wsUrl]);

  const [activeMethod, setActiveMethod] = useState<SubscriptionMethod>("programSubscribe");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ url: false, programId: false });

  const ws = useWebSocketManager();
  const requestIdRef = { current: 0 };

  const handleMethodChange = useCallback((method: string) => {
    const m = method as SubscriptionMethod;
    setActiveMethod(m);
    setForm((prev) => ({ ...prev, method: m }));
    setErrors({});
    setTouched({ url: false, programId: false });
  }, []);

  const handleValidateUrl = useCallback(() => {
    setTouched((t) => ({ ...t, url: true }));
    setErrors((e) => ({ ...e, url: validateUrl(wsUrl) }));
  }, [wsUrl]);

  const handleValidateProgramId = useCallback(() => {
    setTouched((t) => ({ ...t, programId: true }));
    setErrors((e) => ({ ...e, programId: validateProgramId(form.programSubscribe.programId) }));
  }, [form.programSubscribe.programId]);

  const filterErrors = useMemo(
    () => validateFilters(form.programSubscribe.filters),
    [form.programSubscribe.filters],
  );

  const isValid = useMemo(() => {
    const urlErr = validateUrl(wsUrl);
    const { programId: pidErr, filters: fErrs } = validateForm(form);
    return !urlErr && !pidErr && Object.keys(fErrs).length === 0;
  }, [wsUrl, form]);

  const handleSubscribe = useCallback(() => {
    const urlErr = validateUrl(wsUrl);
    const { programId: pidErr, filters: fErrs } = validateForm(form);
    setErrors({ url: urlErr, programId: pidErr, filters: fErrs });
    setTouched({ url: true, programId: true });

    if (urlErr || pidErr || Object.keys(fErrs).length > 0) return;

    requestIdRef.current += 1;
    const request = buildRequest(form, requestIdRef.current);
    ws.connect(wsUrl, request);
  }, [wsUrl, form, ws]);

  const handleUnsubscribe = useCallback(() => {
    ws.disconnect();
  }, [ws]);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Header />
        <WebSocketUrlInput
          value={wsUrl}
          onChange={setWsUrl}
          error={touched.url ? errors.url : undefined}
          onValidate={handleValidateUrl}
        />
        <MethodTabs activeMethod={activeMethod} onSelect={handleMethodChange} />

        <div className="flex flex-col gap-4">
          <RequestBuilderCard
            activeMethod={activeMethod}
            form={form}
            onFormChange={setForm}
            programIdError={touched.programId ? errors.programId : undefined}
            filterErrors={filterErrors}
            onValidateProgramId={handleValidateProgramId}
          />

          <SubscribeButton
            connectionStatus={ws.connectionStatus}
            subscriptionStatus={ws.subscriptionStatus}
            disabled={!isValid}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />

          <StatusBar
            connectionStatus={ws.connectionStatus}
            subscriptionStatus={ws.subscriptionStatus}
          />

          <LogsPanel events={ws.events} onClearLogs={ws.clearLogs} />
        </div>
      </div>
    </div>
  );
}
