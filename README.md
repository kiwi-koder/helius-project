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

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

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
