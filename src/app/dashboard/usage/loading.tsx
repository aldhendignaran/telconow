import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";

export default function UsageLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <SkeletonBlock width="w-40" height="h-8" rounded="lg" />
        <SkeletonBlock width="w-64" height="h-4" rounded="md" />
      </div>
      {/* UsageMeterCard skeleton */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-5">
          <SkeletonBlock width="w-24" height="h-4" rounded="md" />
          <SkeletonBlock width="w-40" height="h-10" rounded="lg" />
          <SkeletonBlock width="w-full" height="h-2" rounded="full" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonBlock height="h-16" rounded="lg" />
            <SkeletonBlock height="h-16" rounded="lg" />
            <SkeletonBlock height="h-16" rounded="lg" />
          </div>
        </div>
      </div>
      {/* UsageHistoryChart skeleton */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-5">
          <SkeletonBlock width="w-32" height="h-4" rounded="md" />
          <div className="flex items-end justify-between gap-2" style={{ height: "120px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock
                key={i}
                width="w-full"
                height={`h-[${40 + i * 10}px]`}
                rounded="lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
