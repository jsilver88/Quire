import { categoryName, lineAmount, summarize } from "@/lib/ledger/calc";
import { formatPretty, invoiceTone, orderTone, safeFilename } from "@/lib/ledger/format";
import type { Category, Company, Invoice, PaymentTerm, PurchaseOrder } from "@/lib/ledger/types";

export type PresentedRow = {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type PresentedDoc = {
  kind: "invoice" | "order";
  kindLabel: "Invoice" | "Purchase order";
  filename: string;
  number: string;
  statusLabel: string;
  tone: "paid" | "due" | "neutral";
  companyName: string;
  companyLines: string[];
  partyLabel: string;
  partyName: string;
  partyMissing: boolean;
  partyEmail: string;
  partyLines: string[];
  facts: { label: string; value: string }[];
  shipTo: string;
  rows: PresentedRow[];
  notes: string;
  taxEnabled: boolean;
  taxRate: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
};

function companyLines(company: Company): string[] {
  const lines: string[] = [];
  if (company.address.trim()) lines.push(...company.address.split(/\n+/).map((line) => line.trim()).filter(Boolean));
  if (company.phone.trim()) lines.push(company.phone.trim());
  if (company.email.trim()) lines.push(company.email.trim());
  if (company.taxId.trim()) lines.push(`Tax ID ${company.taxId.trim()}`);
  return lines;
}

function partyLines(address: string): string[] {
  return address
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function rowsFor(
  items: { id: string; description: string; categoryId: string; quantity: number; unitPrice: number }[],
  categories: Category[],
): PresentedRow[] {
  return items.map((item) => ({
    id: item.id,
    description: item.description.trim() || "Line item",
    category: categoryName(categories, item.categoryId),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: lineAmount(item),
  }));
}

export function presentInvoice(
  invoice: Invoice,
  company: Company,
  categories: Category[],
  terms: PaymentTerm[],
  today: string,
): PresentedDoc {
  const badge = invoiceTone(invoice, today);
  const totals = summarize(invoice.items, invoice.taxEnabled, invoice.taxRate);
  const term = terms.find((item) => item.id === invoice.termId);
  const facts = [
    { label: "Issued", value: formatPretty(invoice.issueDate) },
    { label: "Due", value: formatPretty(invoice.dueDate) },
  ];
  if (term) facts.push({ label: "Terms", value: term.name });
  if (invoice.status === "paid" && invoice.paidOn) facts.push({ label: "Paid", value: formatPretty(invoice.paidOn) });

  return {
    kind: "invoice",
    kindLabel: "Invoice",
    filename: safeFilename(invoice.number || "invoice"),
    number: invoice.number || "Draft",
    statusLabel: badge.label,
    tone: badge.tone,
    companyName: company.name.trim() || "Your business",
    companyLines: companyLines(company),
    partyLabel: "Bill to",
    partyName: invoice.client.name.trim() || "Client name",
    partyMissing: !invoice.client.name.trim(),
    partyEmail: invoice.client.email.trim(),
    partyLines: partyLines(invoice.client.address),
    facts,
    shipTo: "",
    rows: rowsFor(invoice.items, categories),
    notes: invoice.notes,
    taxEnabled: invoice.taxEnabled,
    taxRate: invoice.taxRate,
    ...totals,
    currency: invoice.currency,
  };
}

export function presentOrder(
  order: PurchaseOrder,
  company: Company,
  categories: Category[],
  today: string,
): PresentedDoc {
  const badge = orderTone(order, today);
  const totals = summarize(order.items, order.taxEnabled, order.taxRate);
  const facts = [
    { label: "Issued", value: formatPretty(order.issueDate) },
    { label: "Expected", value: formatPretty(order.expectedDate) },
  ];
  if (order.receivedOn) facts.push({ label: "Received", value: formatPretty(order.receivedOn) });

  return {
    kind: "order",
    kindLabel: "Purchase order",
    filename: safeFilename(order.number || "purchase-order"),
    number: order.number || "Draft",
    statusLabel: badge.label,
    tone: badge.tone,
    companyName: company.name.trim() || "Your business",
    companyLines: companyLines(company),
    partyLabel: "Vendor",
    partyName: order.vendor.name.trim() || "Vendor name",
    partyMissing: !order.vendor.name.trim(),
    partyEmail: order.vendor.email.trim(),
    partyLines: partyLines(order.vendor.address),
    facts,
    shipTo: order.shipTo.trim(),
    rows: rowsFor(order.items, categories),
    notes: order.notes,
    taxEnabled: order.taxEnabled,
    taxRate: order.taxRate,
    ...totals,
    currency: order.currency,
  };
}
