import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const fieldClass =
  "min-h-11 w-full rounded-sm border border-line bg-paper px-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5 text-sm", className)}>
      <span className="font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-faint">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, "min-h-28 py-2", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, className)} {...props} />;
}

export function DecimalInput({
  value,
  onValueChange,
  label,
  max,
  allowEmptyZero = true,
}: {
  value: number;
  onValueChange: (next: number) => void;
  label: string;
  max?: number;
  allowEmptyZero?: boolean;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (allowEmptyZero && value === 0 ? "0" : String(value));
  return (
    <input
      aria-label={label}
      inputMode="decimal"
      autoComplete="off"
      className={fieldClass}
      value={shown}
      onFocus={() => setDraft(String(value))}
      onChange={(event) => {
        const next = event.target.value;
        if (!/^\d*\.?\d{0,2}$/.test(next)) return;
        setDraft(next);
        if (next === "" || next === ".") {
          onValueChange(0);
          return;
        }
        const parsed = Number(next);
        if (!Number.isFinite(parsed)) return;
        if (max != null && parsed > max) return;
        onValueChange(parsed);
      }}
      onBlur={() => setDraft(null)}
    />
  );
}
