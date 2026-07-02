interface CardHeaderProps {
  label: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ label, action, className }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className ?? ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      {action}
    </div>
  );
}
