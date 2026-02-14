"use client";

import { useState, useCallback, useMemo } from "react";
import { FormState, ValidationErrors, Filter, SubscriptionMethod, ProgramSubscribeForm, AccountSubscribeForm, LogsSubscribeForm, SignatureSubscribeForm } from "./lib/types";
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
  programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  commitment: "confirmed",
  encoding: "base64",
  filters: [],
};

const DEFAULT_ACCOUNT_SUBSCRIBE: AccountSubscribeForm = {
  accountId: "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
  commitment: "confirmed",
  encoding: "base64",
};

const DEFAULT_LOGS_SUBSCRIBE: LogsSubscribeForm = {
  filter: "mentions",
  mentionAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  commitment: "confirmed",
};

const DEFAULT_SIGNATURE_SUBSCRIBE: SignatureSubscribeForm = {
  signature: "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
  commitment: "finalized",
  enableReceivedNotification: false,
};

const DEFAULT_FORM: FormState = {
  method: "programSubscribe",
  programSubscribe: DEFAULT_PROGRAM_SUBSCRIBE,
  accountSubscribe: DEFAULT_ACCOUNT_SUBSCRIBE,
  logsSubscribe: DEFAULT_LOGS_SUBSCRIBE,
  signatureSubscribe: DEFAULT_SIGNATURE_SUBSCRIBE,
};

function validateUrl(url: string): string | undefined {
  if (!url.trim()) return "URL is required";
  if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
    return "URL must start with ws:// or wss://";
  }
  return undefined;
}

function validateAddress(id: string, label: string): string | undefined {
  if (!id.trim()) return `${label} is required`;
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

function validateForm(form: FormState): { address?: string; filters: Record<number, string> } {
  switch (form.method) {
    case "programSubscribe": {
      const ps = form.programSubscribe;
      return {
        address: validateAddress(ps.programId, "Program ID"),
        filters: validateFilters(ps.filters),
      };
    }
    case "accountSubscribe": {
      return {
        address: validateAddress(form.accountSubscribe.accountId, "Account address"),
        filters: {},
      };
    }
    case "logsSubscribe": {
      const ls = form.logsSubscribe ?? DEFAULT_LOGS_SUBSCRIBE;
      return {
        address: ls.filter === "mentions" ? validateAddress(ls.mentionAddress, "Mention address") : undefined,
        filters: {},
      };
    }
    case "signatureSubscribe": {
      return {
        address: validateAddress(form.signatureSubscribe.signature, "Transaction signature"),
        filters: {},
      };
    }
    default:
      return { filters: {} };
  }
}

export default function PlaygroundPage() {
  const [wsUrl, setWsUrl] = useState("");

  const [activeMethod, setActiveMethod] = useState<SubscriptionMethod>("programSubscribe");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ url: false, address: false });

  const ws = useWebSocketManager();
  const [requestId, setRequestId] = useState(0);

  const handleMethodChange = useCallback((method: string) => {
    const m = method as SubscriptionMethod;
    setActiveMethod(m);
    setForm((prev) => ({ ...prev, method: m }));
    setErrors({});
    setTouched({ url: false, address: false });
  }, []);

  const handleValidateUrl = useCallback(() => {
    setTouched((t) => ({ ...t, url: true }));
    setErrors((e) => ({ ...e, url: validateUrl(wsUrl) }));
  }, [wsUrl]);

  const handleValidateAddress = useCallback(() => {
    setTouched((t) => ({ ...t, address: true }));
    const { address } = validateForm(form);
    setErrors((e) => ({ ...e, address }));
  }, [form]);

  const filterErrors = useMemo(
    () => validateFilters(form.programSubscribe.filters),
    [form.programSubscribe.filters],
  );

  const handleSubscribe = useCallback(() => {
    const urlErr = validateUrl(wsUrl);
    const { address: addrErr, filters: fErrs } = validateForm(form);
    setErrors({ url: urlErr, address: addrErr, filters: fErrs });
    setTouched({ url: true, address: true });

    if (urlErr || addrErr || Object.keys(fErrs).length > 0) return;

    const nextId = requestId + 1;
    setRequestId(nextId);
    const request = buildRequest(form, nextId);
    ws.connect(wsUrl, request);
  }, [wsUrl, form, ws, requestId]);

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
            addressError={touched.address ? errors.address : undefined}
            filterErrors={filterErrors}
            onValidateAddress={handleValidateAddress}
          />

          <SubscribeButton
            connectionStatus={ws.connectionStatus}
            subscriptionStatus={ws.subscriptionStatus}
            disabled={false}
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
