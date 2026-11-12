import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className="inline-flex h-11 w-14 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span className={cn("relative h-7 w-12 rounded-full", checked ? "bg-ink" : "bg-line-strong")}>
        <span
          className={cn(
            "absolute top-1 left-1 size-5 rounded-full bg-paper transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}
