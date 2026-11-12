import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { blankLine, blankParty } from "@/lib/ledger/calc";
import { addDaysISO, todayISO, uid } from "@/lib/ledger/format";
import { blankData, buildSample, type LedgerData } from "@/lib/ledger/seed";
import type { Category, Company, Invoice, InvoiceStatus, PaymentTerm, PoStatus, PurchaseOrder } from "@/lib/ledger/types";

type LedgerStore = LedgerData & {
  updateCompany: (patch: Partial<Company>) => void;
  addCategory: (name: string, appliesTo: Category["appliesTo"]) => void;
  updateCategory: (id: string, patch: Partial<Pick<Category, "name" | "appliesTo">>) => void;
  removeCategory: (id: string) => void;
  addTerm: (name: string, days: number) => void;
  updateTerm: (id: string, patch: Partial<Pick<PaymentTerm, "name" | "days">>) => void;
  removeTerm: (id: string) => void;
  createInvoice: () => string;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  createOrder: () => string;
  updateOrder: (id: string, patch: Partial<PurchaseOrder>) => void;
  setOrderStatus: (id: string, status: PoStatus) => void;
  deleteOrder: (id: string) => void;
  dismissBanner: () => void;
  loadSample: () => void;
  clearDocuments: () => void;
};

function touch<T extends { updatedAt: string }>(doc: T, patch: Partial<T>): T {
  return { ...doc, ...patch, updatedAt: new Date().toISOString() };
}

function clearCategory<T extends { categoryId: string }>(items: T[], id: string): T[] {
  return items.map((item) => (item.categoryId === id ? { ...item, categoryId: "" } : item));
}

export const useLedger = create<LedgerStore>()(
  persist(
    (set, get) => ({
      ...blankData(),
      updateCompany: (patch) => set((state) => ({ company: { ...state.company, ...patch } })),
      addCategory: (name, appliesTo) =>
        set((state) => ({
          categories: [...state.categories, { id: uid(), name: name.trim(), appliesTo }],
        })),
      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...patch, name: patch.name?.trim() ?? category.name } : category,
          ),
        })),
      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          invoices: state.invoices.map((invoice) => ({
            ...invoice,
            items: clearCategory(invoice.items, id),
          })),
          orders: state.orders.map((order) => ({
            ...order,
            items: clearCategory(order.items, id),
          })),
        })),
      addTerm: (name, days) =>
        set((state) => ({
          terms: [...state.terms, { id: uid(), name: name.trim(), days }],
        })),
      updateTerm: (id, patch) =>
        set((state) => ({
          terms: state.terms.map((term) => (term.id === id ? { ...term, ...patch } : term)),
        })),
      removeTerm: (id) =>
        set((state) => ({
          terms: state.terms.filter((term) => term.id !== id),
          invoices: state.invoices.map((invoice) =>
            invoice.termId === id ? { ...invoice, termId: "" } : invoice,
          ),
        })),
      createInvoice: () => {
        const state = get();
        const id = uid();
        const today = todayISO();
        const term = state.terms.find((item) => item.days === 30) ?? state.terms[0];
        const invoice: Invoice = {
          id,
          number: `${state.company.invoicePrefix}${state.company.nextInvoice}`,
          status: "draft",
          issueDate: today,
          dueDate: addDaysISO(today, term?.days ?? 30),
          termId: term?.id ?? "",
          client: blankParty(),
          items: [blankLine(state.categories, "invoice")],
          taxEnabled: state.company.defaultTaxRate > 0,
          taxRate: state.company.defaultTaxRate,
          notes: "",
          currency: state.company.currency,
          paidOn: null,
          updatedAt: new Date().toISOString(),
        };
        set({
          invoices: [invoice, ...state.invoices],
          company: { ...state.company, nextInvoice: state.company.nextInvoice + 1 },
        });
        return id;
      },
      updateInvoice: (id, patch) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) => (invoice.id === id ? touch(invoice, patch) : invoice)),
        })),
      setInvoiceStatus: (id, status) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) => {
            if (invoice.id !== id) return invoice;
            const today = todayISO();
            return touch(invoice, {
              status,
              paidOn: status === "paid" ? (invoice.paidOn ?? today) : null,
            });
          }),
        })),
      deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((invoice) => invoice.id !== id) })),
      createOrder: () => {
        const state = get();
        const id = uid();
        const today = todayISO();
        const order: PurchaseOrder = {
          id,
          number: `${state.company.poPrefix}${state.company.nextPo}`,
          status: "draft",
          issueDate: today,
          expectedDate: addDaysISO(today, 7),
          vendor: blankParty(),
          shipTo: state.company.address,
          items: [blankLine(state.categories, "order")],
          taxEnabled: state.company.defaultTaxRate > 0,
          taxRate: state.company.defaultTaxRate,
          notes: "",
          currency: state.company.currency,
          receivedOn: null,
          updatedAt: new Date().toISOString(),
        };
        set({
          orders: [order, ...state.orders],
          company: { ...state.company, nextPo: state.company.nextPo + 1 },
        });
        return id;
      },
      updateOrder: (id, patch) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? touch(order, patch) : order)),
        })),
      setOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== id) return order;
            const today = todayISO();
            const keepDate = status === "received" || status === "closed";
            return touch(order, {
              status,
              receivedOn: status === "received" ? (order.receivedOn ?? today) : keepDate ? order.receivedOn : null,
            });
          }),
        })),
      deleteOrder: (id) => set((state) => ({ orders: state.orders.filter((order) => order.id !== id) })),
      dismissBanner: () => set({ banner: "none" }),
      loadSample: () => set(buildSample(todayISO())),
      clearDocuments: () => set({ invoices: [], orders: [], banner: "none" }),
    }),
    {
      name: "quire-ledger-v1",
      skipHydration: true,
      partialize: (state) => ({
        company: state.company,
        categories: state.categories,
        terms: state.terms,
        invoices: state.invoices,
        orders: state.orders,
        bootstrapped: state.bootstrapped,
        banner: state.banner,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
