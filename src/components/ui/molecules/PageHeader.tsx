interface PageHeaderProps {
  greeting: string;
  subtitle: string;
  className?: string;
}

export function PageHeader({ greeting, subtitle, className }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <h1 className="text-[28px] font-bold tracking-tight text-text-primary">{greeting}</h1>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
}
