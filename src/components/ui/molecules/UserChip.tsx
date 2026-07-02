import { Avatar } from "@/components/ui/atoms/Avatar";

interface UserChipProps {
  name: string;
  planName: string;
  initials: string;
  className?: string;
}

export function UserChip({ name, planName, initials, className }: UserChipProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <Avatar initials={initials} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-inverse">{name}</p>
        <p className="truncate text-xs text-text-onDarkMuted">{planName}</p>
      </div>
    </div>
  );
}
