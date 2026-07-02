interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export function Label({ htmlFor, children, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-text-primary ${className ?? ""}`}
    >
      {children}
    </label>
  );
}
