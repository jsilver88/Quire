export type InvoiceStatus = "draft" | "unpaid" | "paid";
export type PoStatus = "draft" | "open" | "scheduled" | "received" | "closed";
export type AppliesTo = "invoice" | "order" | "both";
export type DocKind = "invoice" | "order";

export type Category = {
  id: string;
  name: string;
  appliesTo: AppliesTo;
};

export type PaymentTerm = {
  id: string;
  name: string;
  days: number;
};

export type LineItem = {
  id: string;
  description: string;
  categoryId: string;
  quantity: number;
  unitPrice: number;
};

export type Party = {
  name: string;
  email: string;
  address: string;
};

export type Invoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  termId: string;
  client: Party;
  items: LineItem[];
  taxEnabled: boolean;
  taxRate: number;
  notes: string;
  currency: string;
  paidOn: string | null;
  updatedAt: string;
};

export type PurchaseOrder = {
  id: string;
  number: string;
  status: PoStatus;
  issueDate: string;
  expectedDate: string;
  vendor: Party;
  shipTo: string;
  items: LineItem[];
  taxEnabled: boolean;
  taxRate: number;
  notes: string;
  currency: string;
  receivedOn: string | null;
  updatedAt: string;
};

export type Company = {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  currency: string;
  defaultTaxRate: number;
  invoicePrefix: string;
  poPrefix: string;
  nextInvoice: number;
  nextPo: number;
};

export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NZD"] as const;

export type Banner = "sample" | "none";
