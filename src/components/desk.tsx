import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { billedByCategory, outstandingByCurrency, summarize } from "@/lib/ledger/calc";
import { daysBetween, formatAgenda, formatLong, invoiceOverdue, invoiceTone, money, orderOverdue, orderTone } from "@/lib/ledger/format";
import { useLedger } from "@/lib/ledger/store";

export function Desk({
  today,
  onOpenInvoice,
  onOpenOrder,
  onNewInvoice,
  onNewOrder,
}: {
  today: string;
  onOpenInvoice: (id: string) => void;
  onOpenOrder: (id: string) => void;
  onNewInvoice: () => void;
  onNewOrder: () => void;
}) {
  const company = useLedger((state) => state.company);
  const invoices = useLedger((state) => state.invoices);
  const orders = useLedger((state) => state.orders);
  const categories = useLedger((state) => state.categories);
  const outstanding = outstandingByCurrency(invoices, company.currency);
  const bars = billedByCategory(
    invoices.filter((invoice) => invoice.currency === company.currency),
    categories,
  );
  const maxBar = bars[0]?.amount ?? 0;

  const attention = [
    ...invoices
      .filter((invoice) => invoiceOverdue(invoice, today) || (invoice.status === "unpaid" && daysBetween(today, invoice.dueDate) <= 3 && daysBetween(today, invoice.dueDate) >= 0))
      .map((invoice) => ({
        id: invoice.id,
        kind: "invoice" as const,
        title: invoice.number,
        who: invoice.client.name || "Unnamed client",
        when: invoiceOverdue(invoice, today) ? `Overdue ${formatAgenda(invoice.dueDate)}` : `Due ${formatAgenda(invoice.dueDate)}`,
        sort: invoice.dueDate,
        amount: money(summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total, invoice.currency),
        tone: invoiceTone(invoice, today).tone,
        label: invoiceTone(invoice, today).label,
      })),
    ...orders
      .filter((order) => orderOverdue(order, today))
      .map((order) => ({
        id: order.id,
        kind: "order" as const,
        title: order.number,
        who: order.vendor.name || "Unnamed vendor",
        when: `Expected ${formatAgenda(order.expectedDate)}`,
        sort: order.expectedDate,
        amount: money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency),
        tone: orderTone(order, today).tone,
        label: orderTone(order, today).label,
      })),
  ];

  const upcoming = [
    ...orders
      .filter((order) => (order.status === "open" || order.status === "scheduled") && daysBetween(today, order.expectedDate) >= 0 && daysBetween(today, order.expectedDate) <= 14)
      .map((order) => ({
        id: order.id,
        kind: "order" as const,
        title: order.number,
        who: order.vendor.name || "Unnamed vendor",
        when: formatAgenda(order.expectedDate),
        sort: order.expectedDate,
        amount: money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency),
      })),
    ...invoices
      .filter((invoice) => invoice.status === "unpaid" && daysBetween(today, invoice.dueDate) > 3 && daysBetween(today, invoice.dueDate) <= 21)
      .map((invoice) => ({
        id: invoice.id,
        kind: "invoice" as const,
        title: invoice.number,
        who: invoice.client.name || "Unnamed client",
        when: `Due ${formatAgenda(invoice.dueDate)}`,
        sort: invoice.dueDate,
        amount: money(summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total, invoice.currency),
      })),
  ].sort((a, b) => a.sort.localeCompare(b.sort));

  const landingWeek = orders.filter(
    (order) => (order.status === "open" || order.status === "scheduled") && daysBetween(today, order.expectedDate) >= 0 && daysBetween(today, order.expectedDate) <= 6,
  ).length;
  const openOrders = orders.filter((order) => order.status === "open" || order.status === "scheduled").length;
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{formatLong(today)}</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight text-ink">Desk</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={onNewInvoice}>
            New invoice
          </Button>
          <Button onClick={onNewOrder}>New purchase order</Button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-line bg-surface p-4 sm:col-span-1">
          <p className="text-sm text-muted">Outstanding</p>
          {outstanding.length === 0 ? (
            <p className="mt-2 font-display text-4xl tracking-tight tabular-nums">{money(0, company.currency)}</p>
          ) : (
            <div className="mt-2 grid gap-1">
              {outstanding.map(([currency, amount]) => (
                <p key={currency} className="font-display text-4xl tracking-tight tabular-nums">
                  {money(amount, currency)}
                </p>
              ))}
            </div>
          )}
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm text-muted">Needs a look</p>
          <p className="mt-2 font-display text-4xl tracking-tight tabular-nums">{attention.length}</p>
          <p className="text-sm text-faint">Due within three days, or late</p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm text-muted">On the schedule</p>
          <p className="mt-2 font-display text-4xl tracking-tight tabular-nums">{landingWeek}</p>
          <p className="text-sm text-faint">{openOrders} still out, {landingWeek} landing this week</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-display text-2xl tracking-tight">Needs attention</h2>
          {attention.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing overdue, and nothing due in the next three days.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {attention.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => (item.kind === "invoice" ? onOpenInvoice(item.id) : onOpenOrder(item.id))}
                    className="flex w-full min-h-11 items-center justify-between gap-3 py-3 text-left"
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        <Badge tone={item.tone}>{item.label}</Badge>
                      </span>
                      <span className="mt-1 block truncate text-sm text-muted">
                        {item.who} · {item.when}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums">{item.amount}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-display text-2xl tracking-tight">Coming up</h2>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No deliveries or invoice due dates in the next few weeks.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {upcoming.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => (item.kind === "invoice" ? onOpenInvoice(item.id) : onOpenOrder(item.id))}
                    className="flex w-full min-h-11 items-center justify-between gap-3 py-3 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{item.title}</span>
                      <span className="mt-1 block truncate text-sm text-muted">
                        {item.who} · {item.when}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums">{item.amount}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl tracking-tight">Billed by category</h2>
        <p className="mt-1 text-sm text-muted">Before tax, excluding drafts. Categories are yours to rename in Settings.</p>
        {bars.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Categories fill in as you bill.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {bars.map((bar) => (
              <li key={bar.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{bar.name}</span>
                  <span className="tabular-nums text-muted">{money(bar.amount, company.currency)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-wash">
                  <div
                    className="h-2 rounded-full bg-ink"
                    style={{ width: `${Math.max(4, Math.round((bar.amount / maxBar) * 100))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
