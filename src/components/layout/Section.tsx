import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  background?: "white" | "tint" | "dark";
  className?: string;
  id?: string;
}

export function Section({ children, background = "white", className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-16 md:py-20",
        {
          "bg-surface": background === "white",
          "bg-bg": background === "tint",
          "bg-panel": background === "dark",
        },
        className
      )}
    >
      {children}
    </section>
  );
}
