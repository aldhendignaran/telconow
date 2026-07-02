import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";

export default function BillingLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <SkeletonBlock width="w-24" height="h-8" rounded="lg" />
        <SkeletonBlock width="w-48" height="h-4" rounded="md" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="flex flex-col gap-4">
              <SkeletonBlock width="w-20" height="h-4" rounded="md" />
              <SkeletonBlock width="w-32" height="h-10" rounded="lg" />
              <SkeletonBlock width="w-full" height="h-px" rounded="sm" />
              <SkeletonBlock width="w-full" height="h-4" rounded="md" />
              <SkeletonBlock width="w-full" height="h-4" rounded="md" />
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="flex flex-col gap-4">
              <SkeletonBlock width="w-40" height="h-4" rounded="md" />
              <SkeletonBlock width="w-full" height="h-12" rounded="lg" />
              <SkeletonBlock width="w-full" height="h-12" rounded="lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-3">
          <SkeletonBlock width="w-32" height="h-4" rounded="md" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} width="w-full" height="h-12" rounded="lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
