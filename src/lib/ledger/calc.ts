import { round2, uid } from "@/lib/ledger/format";
import type { Category, DocKind, Invoice, LineItem } from "@/lib/ledger/types";

export function lineAmount(item: LineItem): number {
  return round2(item.quantity * item.unitPrice);
}

export function summarize(items: LineItem[], taxEnabled: boolean, taxRate: number) {
  const subtotal = round2(items.reduce((sum, item) => sum + lineAmount(item), 0));
  const tax = taxEnabled ? round2(subtotal * (taxRate / 100)) : 0;
  return { subtotal, tax, total: round2(subtotal + tax) };
}

export function categoriesFor(categories: Category[], kind: DocKind): Category[] {
  return categories.filter((category) => category.appliesTo === "both" || category.appliesTo === kind);
}

export function categoryName(categories: Category[], id: string): string {
  if (!id) return "Uncategorized";
  return categories.find((category) => category.id === id)?.name ?? "Uncategorized";
}

export function blankLine(categories: Category[], kind: DocKind): LineItem {
  const category = categoriesFor(categories, kind)[0];
  return {
    id: uid(),
    description: "",
    categoryId: category?.id ?? "",
    quantity: 1,
    unitPrice: 0,
  };
}

export function outstandingByCurrency(invoices: Invoice[], preferred: string): [string, number][] {
  const map = new Map<string, number>();
  for (const invoice of invoices) {
    if (invoice.status !== "unpaid") continue;
    const total = summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total;
    map.set(invoice.currency, round2((map.get(invoice.currency) ?? 0) + total));
  }
  return [...map.entries()].sort((a, b) => {
    if (a[0] === preferred) return -1;
    if (b[0] === preferred) return 1;
    return b[1] - a[1];
  });
}

export function billedByCategory(invoices: Invoice[], categories: Category[]) {
  const map = new Map<string, number>();
  for (const invoice of invoices) {
    if (invoice.status === "draft") continue;
    for (const item of invoice.items) {
      const key = item.categoryId || "none";
      map.set(key, round2((map.get(key) ?? 0) + lineAmount(item)));
    }
  }
  return [...map.entries()]
    .map(([id, amount]) => ({
      id,
      name: id === "none" ? "Uncategorized" : categoryName(categories, id),
      amount,
    }))
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function blankParty() {
  return { name: "", email: "", address: "" };
}
