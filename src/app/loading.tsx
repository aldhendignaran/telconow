import { SkeletonBlock } from "@/components/ui/atoms/SkeletonBlock";
import { Container } from "@/components/layout/Container";

export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="w-full bg-panel">
        <Container>
          <div className="flex h-[440px] items-center">
            <div className="flex w-[55%] flex-col gap-6">
              <SkeletonBlock width="w-40" height="h-7" rounded="full" />
              <div className="flex flex-col gap-3">
                <SkeletonBlock width="w-3/4" height="h-14" />
                <SkeletonBlock width="w-1/2" height="h-14" />
              </div>
              <SkeletonBlock width="w-full" height="h-6" />
              <SkeletonBlock width="w-4/5" height="h-6" />
              <div className="flex gap-4">
                <SkeletonBlock width="w-36" height="h-[52px]" rounded="lg" />
                <SkeletonBlock width="w-36" height="h-[52px]" rounded="lg" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Plans skeleton */}
      <div className="w-full bg-bg py-16 md:py-20">
        <Container>
          <div className="mb-10 flex flex-col items-center gap-3">
            <SkeletonBlock width="w-24" height="h-4" />
            <SkeletonBlock width="w-64" height="h-9" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-5 rounded-xl bg-surface p-8">
                <SkeletonBlock width="w-16" height="h-4" />
                <SkeletonBlock width="w-24" height="h-10" />
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <SkeletonBlock key={j} width="w-full" height="h-4" />
                  ))}
                </div>
                <SkeletonBlock width="w-full" height="h-[52px]" rounded="lg" />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
