import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Desk } from "@/components/desk";
import { DocumentEditor } from "@/components/editor";
import { InvoiceList } from "@/components/invoice-list";
import { OrderBoard } from "@/components/order-board";
import { SettingsPanel } from "@/components/settings-panel";
import { Shell, type AppView } from "@/components/shell";
import { todayISO } from "@/lib/ledger/format";
import { useLedger } from "@/lib/ledger/store";
import "sonner/dist/styles.css";

const VIEWS: AppView[] = ["desk", "invoices", "invoice", "orders", "order", "settings"];

type LedgerSearch = {
  view: AppView;
  id?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): LedgerSearch => {
    const view = VIEWS.includes(search.view as AppView) ? (search.view as AppView) : "desk";
    const id = typeof search.id === "string" && search.id.length > 0 ? search.id : undefined;
    return id ? { view, id } : { view };
  },
  component: Home,
});

function Home() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState(todayISO());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await useLedger.persist.rehydrate();
      if (cancelled) return;
      if (!useLedger.getState().bootstrapped) useLedger.getState().loadSample();
      if (cancelled) return;
      setToday(todayISO());
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const titles: Record<AppView, string> = {
      desk: "Desk",
      invoices: "Invoices",
      invoice: "Invoice",
      orders: "Purchase orders",
      order: "Purchase order",
      settings: "Settings",
    };
    document.title = `${titles[search.view]} · Quire`;
  }, [search.view]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [search.view, search.id]);

  function go(view: AppView, id?: string) {
    void navigate({ search: id ? { view, id } : { view } });
  }

  function newInvoice() {
    go("invoice", useLedger.getState().createInvoice());
  }

  function newOrder() {
    go("order", useLedger.getState().createOrder());
  }

  const view = search.view;
  const id = search.id;

  return (
    <Shell view={view} onNavigate={(next) => go(next)}>
      {!ready ? (
        <p className="text-sm text-muted">Opening your books…</p>
      ) : view === "desk" ? (
        <Desk today={today} onOpenInvoice={(docId) => go("invoice", docId)} onOpenOrder={(docId) => go("order", docId)} onNewInvoice={newInvoice} onNewOrder={newOrder} />
      ) : view === "invoices" || (view === "invoice" && !id) ? (
        <InvoiceList today={today} onOpen={(docId) => go("invoice", docId)} onCreate={newInvoice} />
      ) : view === "invoice" && id ? (
        <DocumentEditor kind="invoice" id={id} today={today} onBack={() => go("invoices")} />
      ) : view === "orders" || (view === "order" && !id) ? (
        <OrderBoard today={today} onOpen={(docId) => go("order", docId)} onCreate={newOrder} />
      ) : view === "order" && id ? (
        <DocumentEditor kind="order" id={id} today={today} onBack={() => go("orders")} />
      ) : (
        <SettingsPanel />
      )}
      <Toaster position="bottom-center" toastOptions={{ className: "quire-toast" }} />
    </Shell>
  );
}
