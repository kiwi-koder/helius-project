interface Props {
  json: object;
}

export default function RawJsonPreview({ json }: Props) {
  return (
    <pre className="overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed text-foreground font-mono max-h-80">
      {JSON.stringify(json, null, 2)}
    </pre>
  );
}
