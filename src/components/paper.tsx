import { Badge } from "@/components/ui/badge";
import { formatQty, money } from "@/lib/ledger/format";
import type { PresentedDoc } from "@/lib/ledger/present";
import { cn } from "@/lib/cn";

function rateLabel(rate: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rate);
}

export function Paper({ doc }: { doc: PresentedDoc }) {
  const totals = [
    { label: "Subtotal", value: money(doc.subtotal, doc.currency) },
    ...(doc.taxEnabled
      ? [{ label: `Tax ${rateLabel(doc.taxRate)}%`, value: money(doc.tax, doc.currency) }]
      : []),
    { label: "Total", value: money(doc.total, doc.currency), emphasize: true },
  ];

  return (
    <article className="overflow-hidden rounded-sm border border-line bg-paper text-ink shadow-paper">
      <div className="h-2 bg-ink" />
      <div className="p-5 sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-3xl tracking-tight">{doc.companyName}</p>
            <div className="mt-2 space-y-0.5 text-sm text-muted">
              {doc.companyLines.map((line) => (
                <p key={line} className="break-words">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">{doc.kindLabel}</p>
            <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{doc.number}</p>
            <div className="mt-2">
              <Badge tone={doc.tone}>{doc.statusLabel}</Badge>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-widest text-faint uppercase">{doc.partyLabel}</p>
            <p className={cn("mt-1 text-base font-medium", doc.partyMissing && "text-faint")}>{doc.partyName}</p>
            {doc.partyLines.map((line) => (
              <p key={line} className="text-sm break-words text-muted">
                {line}
              </p>
            ))}
            {doc.partyEmail ? <p className="text-sm break-all text-muted">{doc.partyEmail}</p> : null}
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:justify-items-end">
            {doc.facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-sm text-faint">{fact.label}</dt>
                <dd className="text-sm font-medium tabular-nums sm:text-right">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {doc.shipTo ? (
          <div className="mt-5">
            <p className="text-xs font-medium tracking-widest text-faint uppercase">Ship to</p>
            <p className="mt-1 text-sm whitespace-pre-line text-muted">{doc.shipTo}</p>
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink text-xs tracking-wide text-muted uppercase">
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {doc.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-muted">
                    No line items yet.
                  </td>
                </tr>
              ) : (
                doc.rows.map((row) => (
                  <tr key={row.id} className="border-b border-line">
                    <td className="py-2 pr-3">{row.description}</td>
                    <td className="py-2 pr-3 text-muted">{row.category}</td>
                    <td className="py-2 text-right tabular-nums">{formatQty(row.quantity)}</td>
                    <td className="py-2 text-right tabular-nums">{money(row.unitPrice, doc.currency)}</td>
                    <td className="py-2 text-right tabular-nums">{money(row.amount, doc.currency)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <dl className="mt-4 ml-auto grid max-w-xs gap-1 text-sm">
          {totals.map((line) => (
            <div key={line.label} className={cn("flex justify-between gap-6", line.emphasize && "mt-1 border-t border-ink pt-2 text-base font-medium")}>
              <dt className={line.emphasize ? "text-ink" : "text-muted"}>{line.label}</dt>
              <dd className="tabular-nums">{line.value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-8 border-t border-line pt-4">
          <h2 className="text-xs font-medium tracking-widest text-faint uppercase">Notes</h2>
          {doc.notes.trim() ? (
            <p className="mt-2 text-sm whitespace-pre-line text-ink">{doc.notes}</p>
          ) : (
            <p className="mt-2 text-sm text-faint">Notes appear here, at the bottom of the document.</p>
          )}
        </section>
      </div>
    </article>
  );
}
