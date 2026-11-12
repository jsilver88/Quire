import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChoiceRow } from "@/components/ui/choice-row";
import { Input } from "@/components/ui/fields";
import { summarize } from "@/lib/ledger/calc";
import { cn } from "@/lib/cn";
import { formatAgenda, formatLong, money, orderOnSchedule, orderOverdue, orderTone, parseISODate, todayISO } from "@/lib/ledger/format";
import { useLedger } from "@/lib/ledger/store";
import type { PurchaseOrder } from "@/lib/ledger/types";

type Filter = "all" | "draft" | "open" | "scheduled" | "overdue" | "received" | "closed";

export function OrderBoard({
  today,
  onOpen,
  onCreate,
}: {
  today: string;
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const orders = useLedger((state) => state.orders);
  const updateOrder = useLedger((state) => state.updateOrder);
  const setOrderStatus = useLedger((state) => state.setOrderStatus);
  const [cursor, setCursor] = useState(() => startOfMonth(parseISODate(today)));
  const [selected, setSelected] = useState(today);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor)),
    end: endOfWeek(endOfMonth(cursor)),
  });

  const byDate = useMemo(() => {
    const map = new Map<string, PurchaseOrder[]>();
    for (const order of orders) {
      if (!orderOnSchedule(order)) continue;
      const list = map.get(order.expectedDate) ?? [];
      list.push(order);
      map.set(order.expectedDate, list);
    }
    return map;
  }, [orders]);

  const selectedOrders = (byDate.get(selected) ?? []).slice().sort((a, b) => a.number.localeCompare(b.number));
  const overdue = orders.filter((order) => orderOverdue(order, today));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((order) => {
        if (filter === "overdue") return orderOverdue(order, today);
        if (filter === "all") return true;
        return order.status === filter;
      })
      .filter((order) => {
        if (!q) return true;
        return [order.number, order.vendor.name, order.vendor.email, order.notes, order.shipTo]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => a.expectedDate.localeCompare(b.expectedDate) || a.number.localeCompare(b.number));
  }, [filter, orders, query, today]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Purchase orders</h1>
          <p className="mt-1 text-sm text-muted">The expected date is the schedule. Reschedule it here or in the order.</p>
        </div>
        <Button variant="primary" onClick={onCreate}>
          New purchase order
        </Button>
      </div>

      {overdue.length > 0 ? (
        <section className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="due">Overdue</Badge>
            <p className="text-sm text-muted">{overdue.length} past the expected date and not received.</p>
          </div>
          <ul className="mt-2 divide-y divide-line">
            {overdue.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <button type="button" className="min-h-11 text-left text-sm font-medium" onClick={() => onOpen(order.id)}>
                  {order.number} · {order.vendor.name || "Unnamed vendor"} · {formatAgenda(order.expectedDate)}
                </button>
                <Button onClick={() => setOrderStatus(order.id, "received")}>Mark received</Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-2xl tracking-tight">{format(cursor, "MMMM yyyy")}</h2>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Previous month"
                className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-wash"
                onClick={() => setCursor((value) => addMonths(value, -1))}
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                className="min-h-11 rounded-sm px-3 text-sm font-medium hover:bg-wash"
                onClick={() => {
                  setCursor(startOfMonth(parseISODate(today)));
                  setSelected(today);
                }}
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Next month"
                className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-wash"
                onClick={() => setCursor((value) => addMonths(value, 1))}
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-faint">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
              <div key={label} className="py-1">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const iso = todayISO(day);
              const list = byDate.get(iso) ?? [];
              const selectedDay = iso === selected;
              const inMonth = isSameMonth(day, cursor);
              const isToday = isSameDay(day, parseISODate(today));
              const hasOverdue = list.some((order) => orderOverdue(order, today));
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  aria-pressed={selectedDay}
                  aria-label={formatLong(iso)}
                  className={cn(
                    "flex h-12 flex-col items-center justify-center rounded-sm text-sm tabular-nums",
                    selectedDay ? "bg-ink text-paper" : "hover:bg-wash",
                    !inMonth && !selectedDay && "text-faint",
                    isToday && !selectedDay && "ring-1 ring-ink",
                  )}
                >
                  {format(day, "d")}
                  {list.length > 0 ? (
                    <span className={cn("mt-0.5 size-1.5 rounded-full", hasOverdue ? "bg-due" : selectedDay ? "bg-paper" : "bg-ink")} />
                  ) : (
                    <span className="mt-0.5 size-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-display text-2xl tracking-tight">{formatLong(selected)}</h2>
          {selectedOrders.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing landing this day.</p>
          ) : (
            <ul className="mt-3 grid gap-3">
              {selectedOrders.map((order) => {
                const badge = orderTone(order, today);
                return (
                  <li key={order.id} className="rounded-xl border border-line p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button type="button" className="text-left font-medium" onClick={() => onOpen(order.id)}>
                        {order.number}
                      </button>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </div>
                    <p className="text-sm text-muted">{order.vendor.name || "Unnamed vendor"}</p>
                    <p className="text-sm tabular-nums">
                      {money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-end gap-2">
                      <label className="grid gap-1 text-xs text-faint">
                        Reschedule
                        <input
                          type="date"
                          className="min-h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
                          value={order.expectedDate}
                          aria-label={`Reschedule ${order.number}`}
                          onChange={(event) => updateOrder(order.id, { expectedDate: event.target.value })}
                        />
                      </label>
                      {order.status === "received" ? (
                        <Button onClick={() => setOrderStatus(order.id, "open")}>Reopen</Button>
                      ) : (
                        <Button onClick={() => setOrderStatus(order.id, "received")}>Mark received</Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search number, vendor, or note"
          aria-label="Search purchase orders"
        />
        <ChoiceRow
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "scheduled", label: "Scheduled" },
            { value: "overdue", label: "Overdue" },
            { value: "received", label: "Received" },
            { value: "draft", label: "Draft" },
            { value: "closed", label: "Closed" },
          ]}
        />
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
            <p className="font-display text-2xl">No purchase orders here</p>
            <p className="mt-2 text-sm text-muted">
              {orders.length === 0 ? "Issue one and put the delivery on the calendar." : "Nothing matches this filter."}
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {visible.map((order) => {
              const badge = orderTone(order, today);
              return (
                <li key={order.id} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{order.number}</p>
                        <Badge tone={badge.tone}>{badge.label}</Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted">{order.vendor.name || "Unnamed vendor"}</p>
                      <p className="text-sm text-faint">Expected {formatAgenda(order.expectedDate)}</p>
                    </div>
                    <p className="font-display text-2xl tabular-nums">
                      {money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency)}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button onClick={() => onOpen(order.id)}>Open</Button>
                    {order.status !== "received" && order.status !== "closed" ? (
                      <Button onClick={() => setOrderStatus(order.id, "received")}>Mark received</Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
