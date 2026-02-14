interface HeaderProps {
  compact?: boolean;
}

export default function Header({ compact = true }: HeaderProps) {
  return (
    <div className={`transition-all duration-700 ease-out ${compact ? "mb-6" : "mb-8 text-center"}`}>
      <h1
        className={`font-bold tracking-tight text-foreground transition-all duration-700 ease-out ${
          compact ? "text-2xl" : "text-4xl"
        }`}
      >
        Helius WebSocket Playground
      </h1>
      <p
        className={`mt-1 text-muted-foreground transition-all duration-700 ease-out ${
          compact ? "text-sm" : "text-lg"
        }`}
      >
        Test Helius WebSocket subscriptions in real time
      </p>
    </div>
  );
}
