import { cn } from "@/lib/utils";

interface ClusterProps {
  children: React.ReactNode;
  gap?: 2 | 3 | 4 | 6 | 8;
  align?: "start" | "center" | "end";
  wrap?: boolean;
  className?: string;
}

const gapMap: Record<number, string> = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

export function Cluster({ children, gap = 2, align = "center", wrap = false, className }: ClusterProps) {
  return (
    <div className={cn("flex flex-row", gapMap[gap], alignMap[align], wrap && "flex-wrap", className)}>
      {children}
    </div>
  );
}
