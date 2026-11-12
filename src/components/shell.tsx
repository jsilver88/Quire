import type { ReactNode } from "react";
import { ClipboardList, FileText, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLedger } from "@/lib/ledger/store";

export type AppView = "desk" | "invoices" | "invoice" | "orders" | "order" | "settings";

const NAV: { view: AppView; label: string; icon: typeof FileText }[] = [
  { view: "desk", label: "Desk", icon: LayoutDashboard },
  { view: "invoices", label: "Invoices", icon: FileText },
  { view: "orders", label: "Orders", icon: ClipboardList },
  { view: "settings", label: "Settings", icon: Settings },
];

function isActive(current: AppView, item: AppView) {
  if (item === "invoices") return current === "invoices" || current === "invoice";
  if (item === "orders") return current === "orders" || current === "order";
  return current === item;
}

export function Shell({
  view,
  onNavigate,
  children,
}: {
  view: AppView;
  onNavigate: (view: AppView) => void;
  children: ReactNode;
}) {
  const company = useLedger((state) => state.company);
  const unpaid = useLedger((state) => state.invoices.filter((invoice) => invoice.status === "unpaid").length);
  const activeOrders = useLedger(
    (state) => state.orders.filter((order) => order.status === "open" || order.status === "scheduled").length,
  );
  const banner = useLedger((state) => state.banner);
  const dismissBanner = useLedger((state) => state.dismissBanner);
  const counts: Partial<Record<AppView, number>> = {
    invoices: unpaid,
    orders: activeOrders,
  };

  return (
    <div className="min-h-screen bg-bg md:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 md:flex">
        <p className="font-display text-3xl tracking-tight text-ink">Quire</p>
        <p className="mt-1 text-sm text-muted">Invoices and purchase orders</p>
        <nav className="mt-8 grid gap-1" aria-label="Primary">
          {NAV.map((item) => (
            <NavButton
              key={item.view}
              item={item}
              active={isActive(view, item.view)}
              count={counts[item.view]}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
        <div className="mt-auto min-w-0">
          <p className="truncate text-sm font-medium text-ink">{company.name || "Your business"}</p>
          <p className="truncate text-xs text-faint">{company.email || "Saved in this browser"}</p>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-line bg-bg md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="font-display text-2xl leading-none text-ink">Quire</p>
            <p className="max-w-40 truncate text-xs text-muted">{company.name || "Your business"}</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3" aria-label="Primary">
            {NAV.map((item) => {
              const active = isActive(view, item.view);
              return (
                <button
                  key={item.view}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => onNavigate(item.view)}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm px-3 text-sm font-medium",
                    active ? "bg-ink text-paper" : "bg-surface text-ink",
                  )}
                >
                  {item.label}
                  {counts[item.view] ? (
                    <span className="tabular-nums text-xs opacity-70">{counts[item.view]}</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-5 md:px-8 md:py-8">
          {banner === "sample" ? (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
              <p className="max-w-2xl text-sm text-muted">
                Sample books for Northline Atelier are in this browser. Clear them in Settings when you want your own.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate("settings")}
                  className="min-h-11 rounded-sm px-3 text-sm font-medium text-ink hover:bg-wash"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="min-h-11 rounded-sm px-3 text-sm font-medium text-muted hover:bg-wash"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  count,
  onNavigate,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  count?: number;
  onNavigate: (view: AppView) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onNavigate(item.view)}
      className={cn(
        "flex min-h-11 items-center justify-between rounded-sm px-3 text-left text-sm font-medium",
        active ? "bg-ink text-paper" : "text-ink hover:bg-wash",
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className="size-4" aria-hidden />
        {item.label}
      </span>
      {count ? <span className="tabular-nums text-xs opacity-70">{count}</span> : null}
    </button>
  );
}
