import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <SkeletonBlock height="h-8" width="w-64" />
        <SkeletonBlock height="h-4" width="w-96" />
      </div>

      {/* Row 1: Plan (4) + Usage (8) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 rounded-xl bg-surface p-6">
          <SkeletonBlock height="h-3" width="w-24" className="mb-4" />
          <SkeletonBlock height="h-8" width="w-32" className="mb-2" />
          <SkeletonBlock height="h-6" width="w-20" className="mb-4" />
          <SkeletonBlock height="h-px" className="mb-4" />
          <SkeletonBlock height="h-4" className="mb-2" />
          <SkeletonBlock height="h-4" />
        </div>
        <div className="col-span-8 rounded-xl bg-surface p-6">
          <SkeletonBlock height="h-3" width="w-24" className="mb-4" />
          <SkeletonBlock height="h-8" width="w-48" className="mb-4" />
          <SkeletonBlock height="h-2.5" className="mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonBlock height="h-16" rounded="lg" />
            <SkeletonBlock height="h-16" rounded="lg" />
            <SkeletonBlock height="h-16" rounded="lg" />
          </div>
        </div>
      </div>

      {/* Row 2: Billing (4) + Activity (8) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 rounded-xl bg-surface p-6">
          <SkeletonBlock height="h-3" width="w-16" className="mb-4" />
          <SkeletonBlock height="h-10" width="w-24" className="mb-4" />
          <SkeletonBlock height="h-px" className="mb-4" />
          <SkeletonBlock height="h-4" className="mb-2" />
          <SkeletonBlock height="h-4" />
        </div>
        <div className="col-span-8 rounded-xl bg-surface p-6">
          <SkeletonBlock height="h-3" width="w-32" className="mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <SkeletonBlock width="w-9" height="h-9" rounded="lg" />
              <div className="flex-1">
                <SkeletonBlock height="h-4" width="w-40" className="mb-1" />
                <SkeletonBlock height="h-3" width="w-24" />
              </div>
              <SkeletonBlock height="h-4" width="w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Chart (12) */}
      <div className="col-span-12 rounded-xl bg-surface p-7">
        <SkeletonBlock height="h-3" width="w-28" className="mb-2" />
        <SkeletonBlock height="h-5" width="w-64" className="mb-6" />
        <SkeletonBlock height="h-40" />
      </div>

      {/* Row 4: Tickets (4) + Addons (6) + Banner (6) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4 rounded-xl bg-surface p-6">
          <SkeletonBlock height="h-3" width="w-28" className="mb-4" />
          <SkeletonBlock height="h-20" rounded="lg" className="mb-2" />
          <SkeletonBlock height="h-20" rounded="lg" className="mb-4" />
          <SkeletonBlock height="h-9" rounded="lg" />
        </div>
        <div className="col-span-6 rounded-xl bg-surface p-6">
          <SkeletonBlock height="h-3" width="w-24" className="mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <SkeletonBlock width="w-10" height="h-10" rounded="lg" />
              <div className="flex-1">
                <SkeletonBlock height="h-4" width="w-36" className="mb-1" />
                <SkeletonBlock height="h-3" width="w-20" />
              </div>
              <SkeletonBlock width="w-8" height="h-5" rounded="full" />
            </div>
          ))}
        </div>
        <div className="col-span-2 rounded-xl bg-accent-tint p-6">
          <SkeletonBlock height="h-5" width="w-20" className="mb-3" />
          <SkeletonBlock height="h-12" className="mb-3" />
          <SkeletonBlock height="h-4" className="mb-4" />
          <SkeletonBlock height="h-9" width="w-28" rounded="lg" />
        </div>
      </div>
    </div>
  );
}
