import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/ledger/format";

const tones: Record<Tone, string> = {
  paid: "bg-paid-bg text-paid",
  due: "bg-due-bg text-due",
  neutral: "bg-wash text-muted",
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
