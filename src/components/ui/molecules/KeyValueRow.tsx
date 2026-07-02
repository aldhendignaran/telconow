interface KeyValueRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function KeyValueRow({ label, value, className }: KeyValueRowProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className ?? ""}`}>
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}
