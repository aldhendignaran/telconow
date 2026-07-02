import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
}

const gapMap: Record<number, string> = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

export function Stack({ children, gap = 4, className }: StackProps) {
  return (
    <div className={cn("flex flex-col", gapMap[gap], className)}>
      {children}
    </div>
  );
}
