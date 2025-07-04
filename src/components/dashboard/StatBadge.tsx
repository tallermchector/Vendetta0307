import { cn } from "@/lib/utils";

export function StatBadge({
  count,
  Icon,
  className,
}: {
  count: number;
  Icon: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md border border-primary/50 bg-background transition-colors hover:bg-primary/10",
        className
      )}
    >
      <Icon className="h-5 w-5 text-primary" />
      <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {count}
      </div>
    </div>
  );
}
