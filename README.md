# Helius WebSocket Playground

An interactive browser-based playground for testing [Helius](https://www.helius.dev/) Solana WebSocket (PubSub) subscriptions in real time.

## Supported Methods

- **programSubscribe** — stream account updates for a given program (with optional `dataSize` / `memcmp` filters)
- **accountSubscribe** — watch a single account for changes
- **logsSubscribe** — tail transaction logs (`all`, `allWithVotes`, or by mention address)
- **slotSubscribe** — receive slot advancement notifications
- **signatureSubscribe** — track a transaction signature until confirmation
- **rootSubscribe** — receive root slot updates

## Key Features

- Preset addresses for quick testing (SPL Token Program, popular accounts)
- Real-time event log with sent/received/error/info entries
- Form validation with inline error messages
- Raw JSON preview of the underlying RPC request
- Auto-reconnect with exponential back-off

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5
- [Tailwind CSS](https://tailwindcss.com/) 4

## Project Structure

```
app/playground/
  PlaygroundPage.tsx           # Main page component (form state, validation, layout)
  hooks/
    useWebSocketManager.ts     # WebSocket lifecycle, reconnect logic, event log
  lib/
    types.ts                   # Shared TypeScript interfaces and types
    buildRequest.ts            # Builds subscribe/unsubscribe messages per method
  components/
    Header.tsx                 # Page header / branding
    MethodTabs.tsx             # Subscription method tab selector
    RequestBuilderCard.tsx     # Card wrapping the active builder form
    SubscribeButton.tsx        # Connect / disconnect button
    StatusBar.tsx              # Connection & subscription status indicator
    LogsPanel.tsx              # Scrollable event log
    RawJsonPreview.tsx         # Collapsible raw JSON request preview
    WebSocketUrlInput.tsx      # Proxy URL display
    builder/
      BuilderForm.tsx          # Renders the correct builder for the active method
      ProgramSubscribeBuilder.tsx
      AccountSubscribeBuilder.tsx
      LogsSubscribeBuilder.tsx
      SignatureSubscribeBuilder.tsx
      AddressInput.tsx         # Reusable address/pubkey input with validation
      ProgramIdInput.tsx       # Program ID input with preset selector
      FiltersBuilder.tsx       # dataSize / memcmp filter list
      FilterRow.tsx            # Single filter row
      SegmentedControl.tsx     # Segmented toggle (commitment, encoding, etc.)
      constants.ts             # Preset addresses and label maps
```

## Getting Started

### Prerequisites

- Node.js 18+
- The companion **[helius-websocket-proxy](https://github.com/kiwi-koder/helius-websocket-proxy)** running locally (or a deployed instance)

### Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_WS_PROXY_URL=ws://localhost:3001
```

> The proxy URL defaults to `ws://localhost:3001` if the variable is not set.

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the playground.

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)   |
| `npm run build` | Production build                   |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |
