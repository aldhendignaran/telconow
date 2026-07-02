import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";

export default function AddonsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <SkeletonBlock width="w-28" height="h-8" rounded="lg" />
        <SkeletonBlock width="w-56" height="h-4" rounded="md" />
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-4">
          <SkeletonBlock width="w-20" height="h-4" rounded="md" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg px-3 py-3">
              <SkeletonBlock width="w-9" height="h-9" rounded="lg" />
              <div className="flex flex-1 flex-col gap-1.5">
                <SkeletonBlock width="w-40" height="h-4" rounded="md" />
                <SkeletonBlock width="w-56" height="h-3" rounded="sm" />
              </div>
              <SkeletonBlock width="w-12" height="h-4" rounded="md" />
              <SkeletonBlock width="w-9" height="h-5" rounded="full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
