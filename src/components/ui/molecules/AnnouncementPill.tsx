interface AnnouncementPillProps {
  label: string;
}

export function AnnouncementPill({ label }: AnnouncementPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-tint2" aria-hidden="true" />
      <span className="text-xs font-medium text-text-onDarkMuted">{label}</span>
    </div>
  );
}
