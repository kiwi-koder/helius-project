/**
 * Main page component for the Helius WebSocket Playground.
 *
 * Manages top-level form state, validation, and orchestrates the WebSocket
 * connection lifecycle via {@link useWebSocketManager}. Renders the method
 * tabs, request builder, subscribe button, status bar, and event log.
 */
"use client";

import { useState, useCallback, useMemo } from "react";
import { FormState, ValidationErrors, Filter, SubscriptionMethod, ProgramSubscribeForm, AccountSubscribeForm, LogsSubscribeForm, SignatureSubscribeForm } from "./lib/types";
import { buildRequest } from "./lib/buildRequest";
import { useWebSocketManager } from "./hooks/useWebSocketManager";
import Header from "./components/Header";
import MethodTabs from "./components/MethodTabs";
import RequestBuilderCard from "./components/RequestBuilderCard";
import SubscribeButton from "./components/SubscribeButton";
import StatusBar from "./components/StatusBar";
import LogsPanel from "./components/LogsPanel";

/** Default form values — each method is pre-filled with well-known Solana addresses for quick testing. */
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

/** Return an error message if the address/key field is empty, otherwise `undefined`. */
function validateAddress(id: string, label: string): string | undefined {
  if (!id.trim()) return `${label} is required`;
  return undefined;
}

/** Validate each filter row, returning a map of row-index to error message. */
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

/** Run all validations for the active method and return any address/filter errors. */
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
  const [activeMethod, setActiveMethod] = useState<SubscriptionMethod>("programSubscribe");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ address: false });

  const ws = useWebSocketManager();

  const handleMethodChange = useCallback((method: string) => {
    const m = method as SubscriptionMethod;
    setActiveMethod(m);
    setForm((prev) => ({ ...prev, method: m }));
    setErrors({});
    setTouched({ address: false });
  }, []);

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
    const { address: addrErr, filters: fErrs } = validateForm(form);
    setErrors({ address: addrErr, filters: fErrs });
    setTouched({ address: true });

    if (addrErr || Object.keys(fErrs).length > 0) return;

    const request = buildRequest(form);
    ws.connect(request);
  }, [form, ws]);

  const handleUnsubscribe = useCallback(() => {
    ws.disconnect();
  }, [ws]);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <Header compact />

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
