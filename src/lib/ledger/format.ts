import type { Invoice, PurchaseOrder } from "@/lib/ledger/types";

export type Tone = "paid" | "due" | "neutral";

export function uid(): string {
  return crypto.randomUUID();
}

export function round2(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function money(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(round2(amount));
}

export function formatQty(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(round2(value));
}

export function formatRate(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(round2(value));
}

export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

export function addDaysISO(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return todayISO(date);
}

export function daysBetween(from: string, to: string): number {
  const a = parseISODate(from).getTime();
  const b = parseISODate(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function formatPretty(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "—";
  return parseISODate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLong(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatAgenda(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function stamp(iso: string): string {
  return `${iso}T15:00:00.000Z`;
}

export function invoiceTone(invoice: Invoice, today: string): { label: string; tone: Tone } {
  if (invoice.status === "paid") return { label: "Paid", tone: "paid" };
  if (invoice.status === "draft") return { label: "Draft", tone: "neutral" };
  if (invoice.dueDate < today) return { label: "Overdue", tone: "due" };
  return { label: "Unpaid", tone: "neutral" };
}

export function orderTone(order: PurchaseOrder, today: string): { label: string; tone: Tone } {
  if (order.status === "received") return { label: "Received", tone: "paid" };
  if (order.status === "closed") return { label: "Closed", tone: "neutral" };
  if (order.status === "draft") return { label: "Draft", tone: "neutral" };
  if (order.expectedDate < today) return { label: "Overdue", tone: "due" };
  if (order.status === "scheduled") return { label: "Scheduled", tone: "neutral" };
  return { label: "Open", tone: "neutral" };
}

export function invoiceOverdue(invoice: Invoice, today: string): boolean {
  return invoice.status === "unpaid" && invoice.dueDate < today;
}

export function orderOverdue(order: PurchaseOrder, today: string): boolean {
  return (order.status === "open" || order.status === "scheduled") && order.expectedDate < today;
}

export function orderOnSchedule(order: PurchaseOrder): boolean {
  return order.status === "open" || order.status === "scheduled" || order.status === "received";
}

export function safeFilename(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${cleaned || "document"}.pdf`;
}
