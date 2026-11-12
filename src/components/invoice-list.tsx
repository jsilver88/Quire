import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChoiceRow } from "@/components/ui/choice-row";
import { Input } from "@/components/ui/fields";
import { summarize } from "@/lib/ledger/calc";
import { formatPretty, invoiceOverdue, invoiceTone, money } from "@/lib/ledger/format";
import { presentInvoice } from "@/lib/ledger/present";
import { buildPdf, saveBlob } from "@/lib/ledger/pdf";
import { useLedger } from "@/lib/ledger/store";

type Filter = "all" | "draft" | "unpaid" | "overdue" | "paid";

export function InvoiceList({
  today,
  onOpen,
  onCreate,
}: {
  today: string;
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const invoices = useLedger((state) => state.invoices);
  const company = useLedger((state) => state.company);
  const categories = useLedger((state) => state.categories);
  const terms = useLedger((state) => state.terms);
  const setInvoiceStatus = useLedger((state) => state.setInvoiceStatus);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = {
    all: invoices.length,
    draft: invoices.filter((invoice) => invoice.status === "draft").length,
    unpaid: invoices.filter((invoice) => invoice.status === "unpaid" && !invoiceOverdue(invoice, today)).length,
    overdue: invoices.filter((invoice) => invoiceOverdue(invoice, today)).length,
    paid: invoices.filter((invoice) => invoice.status === "paid").length,
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices
      .filter((invoice) => {
        if (filter === "draft") return invoice.status === "draft";
        if (filter === "paid") return invoice.status === "paid";
        if (filter === "overdue") return invoiceOverdue(invoice, today);
        if (filter === "unpaid") return invoice.status === "unpaid" && !invoiceOverdue(invoice, today);
        return true;
      })
      .filter((invoice) => {
        if (!q) return true;
        const blob = [
          invoice.number,
          invoice.client.name,
          invoice.client.email,
          invoice.notes,
          ...invoice.items.map((item) => item.description),
        ]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      })
      .sort((a, b) => (a.issueDate === b.issueDate ? b.number.localeCompare(a.number) : b.issueDate.localeCompare(a.issueDate)));
  }, [filter, invoices, query, today]);

  async function download(id: string) {
    const invoice = invoices.find((item) => item.id === id);
    if (!invoice) return;
    setBusyId(id);
    try {
      const doc = presentInvoice(invoice, company, categories, terms, today);
      const blob = await buildPdf(doc);
      saveBlob(blob, doc.filename);
      toast("PDF downloaded.");
    } catch {
      toast("Could not create the PDF.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted">Mark them paid or unpaid, then download or email a PDF.</p>
        </div>
        <Button variant="primary" onClick={onCreate}>
          New invoice
        </Button>
      </div>
      <div className="grid gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search number, client, or note"
          aria-label="Search invoices"
        />
        <ChoiceRow
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `All ${counts.all}` },
            { value: "unpaid", label: `Unpaid ${counts.unpaid}` },
            { value: "overdue", label: `Overdue ${counts.overdue}` },
            { value: "draft", label: `Draft ${counts.draft}` },
            { value: "paid", label: `Paid ${counts.paid}` },
          ]}
        />
      </div>
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
          <p className="font-display text-2xl">No invoices here</p>
          <p className="mt-2 text-sm text-muted">
            {invoices.length === 0 ? "Create one, add line items, and download a PDF." : "Nothing matches this filter."}
          </p>
          {invoices.length === 0 ? (
            <Button className="mt-4" variant="primary" onClick={onCreate}>
              New invoice
            </Button>
          ) : null}
        </div>
      ) : (
        <ul className="grid gap-3">
          {visible.map((invoice) => {
            const badge = invoiceTone(invoice, today);
            const total = summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total;
            return (
              <li key={invoice.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{invoice.number}</p>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">{invoice.client.name || "Unnamed client"}</p>
                    <p className="text-sm text-faint">
                      Issued {formatPretty(invoice.issueDate)} · Due {formatPretty(invoice.dueDate)}
                    </p>
                  </div>
                  <p className="font-display text-2xl tabular-nums">{money(total, invoice.currency)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button onClick={() => onOpen(invoice.id)}>Open</Button>
                  {invoice.status === "paid" ? (
                    <Button onClick={() => setInvoiceStatus(invoice.id, "unpaid")}>Mark unpaid</Button>
                  ) : (
                    <Button onClick={() => setInvoiceStatus(invoice.id, "paid")}>Mark paid</Button>
                  )}
                  <Button disabled={busyId === invoice.id} onClick={() => void download(invoice.id)}>
                    {busyId === invoice.id ? "Preparing…" : "PDF"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
