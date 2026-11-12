import { cn } from "@/lib/cn";

export function ChoiceRow<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-11 rounded-sm px-3 text-sm font-medium",
              selected ? "bg-ink text-paper" : "bg-wash text-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
