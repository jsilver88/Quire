import { useState } from "react";
import { toast } from "sonner";
import { EmailDialog, mailFor } from "@/components/email-dialog";
import { LineItems } from "@/components/line-items";
import { Paper } from "@/components/paper";
import { Button } from "@/components/ui/button";
import { ChoiceRow } from "@/components/ui/choice-row";
import { Modal } from "@/components/ui/dialog";
import { DecimalInput, Field, Input, Select, Textarea } from "@/components/ui/fields";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { summarize } from "@/lib/ledger/calc";
import type { MailDraft } from "@/lib/ledger/email";
import { addDaysISO, money } from "@/lib/ledger/format";
import { buildPdf, saveBlob } from "@/lib/ledger/pdf";
import { presentInvoice, presentOrder, type PresentedDoc } from "@/lib/ledger/present";
import { useLedger } from "@/lib/ledger/store";
import type { Invoice, InvoiceStatus, PaymentTerm, PoStatus, PurchaseOrder } from "@/lib/ledger/types";
import { CURRENCIES } from "@/lib/ledger/types";

const INVOICE_STATUS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
];

const ORDER_STATUS: { value: PoStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "scheduled", label: "Scheduled" },
  { value: "received", label: "Received" },
  { value: "closed", label: "Closed" },
];

export function DocumentEditor({
  kind,
  id,
  today,
  onBack,
}: {
  kind: "invoice" | "order";
  id: string;
  today: string;
  onBack: () => void;
}) {
  const invoice = useLedger((state) => state.invoices.find((item) => item.id === id));
  const order = useLedger((state) => state.orders.find((item) => item.id === id));
  const company = useLedger((state) => state.company);
  const categories = useLedger((state) => state.categories);
  const terms = useLedger((state) => state.terms);
  const updateInvoice = useLedger((state) => state.updateInvoice);
  const updateOrder = useLedger((state) => state.updateOrder);
  const setInvoiceStatus = useLedger((state) => state.setInvoiceStatus);
  const setOrderStatus = useLedger((state) => state.setOrderStatus);
  const deleteInvoice = useLedger((state) => state.deleteInvoice);
  const deleteOrder = useLedger((state) => state.deleteOrder);
  const [pane, setPane] = useState<"edit" | "preview">("edit");
  const [mailOpen, setMailOpen] = useState(false);
  const [mail, setMail] = useState<MailDraft | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const presented: PresentedDoc | null =
    kind === "invoice" && invoice
      ? presentInvoice(invoice, company, categories, terms, today)
      : kind === "order" && order
        ? presentOrder(order, company, categories, today)
        : null;

  if (!presented || (kind === "invoice" && !invoice) || (kind === "order" && !order)) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="font-display text-2xl">This document is no longer in your books.</p>
        <Button className="mt-4" onClick={onBack}>
          Back
        </Button>
      </div>
    );
  }

  const doc = presented;
  const totals = summarize(
    kind === "invoice" ? invoice!.items : order!.items,
    kind === "invoice" ? invoice!.taxEnabled : order!.taxEnabled,
    kind === "invoice" ? invoice!.taxRate : order!.taxRate,
  );

  async function download() {
    setBusy(true);
    try {
      const blob = await buildPdf(doc);
      saveBlob(blob, doc.filename);
      toast("PDF downloaded.");
    } catch {
      toast("Could not create the PDF.");
    } finally {
      setBusy(false);
    }
  }

  function remove() {
    if (kind === "invoice") deleteInvoice(id);
    else deleteOrder(id);
    toast("Document removed.");
    onBack();
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" onClick={onBack}>
          {kind === "invoice" ? "All invoices" : "All orders"}
        </Button>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="primary" disabled={busy} onClick={() => void download()}>
            {busy ? "Preparing…" : "Download PDF"}
          </Button>
          <Button
            onClick={() => {
              setMail(mailFor(doc));
              setMailOpen(true);
            }}
          >
            Email
          </Button>
        </div>
      </div>

      <div className="flex gap-2 lg:hidden">
        <button
          type="button"
          aria-pressed={pane === "edit"}
          onClick={() => setPane("edit")}
          className={cn("min-h-11 flex-1 rounded-sm text-sm font-medium", pane === "edit" ? "bg-ink text-paper" : "bg-wash text-muted")}
        >
          Edit
        </button>
        <button
          type="button"
          aria-pressed={pane === "preview"}
          onClick={() => setPane("preview")}
          className={cn(
            "min-h-11 flex-1 rounded-sm text-sm font-medium",
            pane === "preview" ? "bg-ink text-paper" : "bg-wash text-muted",
          )}
        >
          Preview
        </button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className={cn("grid gap-4", pane === "preview" && "hidden lg:grid")}>
          {kind === "invoice" && invoice ? (
            <InvoiceFields
              invoice={invoice}
              terms={terms}
              onChange={(patch) => updateInvoice(id, patch)}
              onStatus={(status) => {
                setInvoiceStatus(id, status);
                toast(status === "paid" ? "Marked paid." : status === "unpaid" ? "Marked unpaid." : "Saved as draft.");
              }}
            />
          ) : null}
          {kind === "order" && order ? (
            <OrderFields
              order={order}
              onChange={(patch) => updateOrder(id, patch)}
              onStatus={(status) => {
                setOrderStatus(id, status);
                toast(status === "received" ? "Marked received." : "Status updated.");
              }}
            />
          ) : null}

          <section className="grid gap-3">
            <h2 className="font-display text-2xl tracking-tight">Line items</h2>
            <LineItems
              kind={kind}
              categories={categories}
              currency={kind === "invoice" ? invoice!.currency : order!.currency}
              items={kind === "invoice" ? invoice!.items : order!.items}
              onChange={(items) =>
                kind === "invoice" ? updateInvoice(id, { items }) : updateOrder(id, { items })
              }
            />
          </section>

          <section className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Tax</p>
                <p className="text-xs text-faint">Optional. Applied once, to the subtotal.</p>
              </div>
              <Switch
                label="Apply tax"
                checked={kind === "invoice" ? invoice!.taxEnabled : order!.taxEnabled}
                onCheckedChange={(taxEnabled) =>
                  kind === "invoice" ? updateInvoice(id, { taxEnabled }) : updateOrder(id, { taxEnabled })
                }
              />
            </div>
            {(kind === "invoice" ? invoice!.taxEnabled : order!.taxEnabled) ? (
              <div className="mt-3 max-w-40">
                <Field label="Rate (%)">
                  <DecimalInput
                    label="Tax rate"
                    max={100}
                    value={kind === "invoice" ? invoice!.taxRate : order!.taxRate}
                    onValueChange={(taxRate) =>
                      kind === "invoice" ? updateInvoice(id, { taxRate }) : updateOrder(id, { taxRate })
                    }
                  />
                </Field>
              </div>
            ) : null}
            <dl className="mt-4 grid gap-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{money(totals.subtotal, doc.currency)}</dd>
              </div>
              {doc.taxEnabled ? (
                <div className="flex justify-between">
                  <dt className="text-muted">Tax</dt>
                  <dd className="tabular-nums">{money(totals.tax, doc.currency)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{money(totals.total, doc.currency)}</dd>
              </div>
            </dl>
          </section>

          <Field label="Notes" hint="Printed at the bottom of the PDF.">
            <Textarea
              value={kind === "invoice" ? invoice!.notes : order!.notes}
              placeholder="Payment details, delivery instructions, a thank-you."
              onChange={(event) =>
                kind === "invoice"
                  ? updateInvoice(id, { notes: event.target.value })
                  : updateOrder(id, { notes: event.target.value })
              }
            />
          </Field>

          <div>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete {kind === "invoice" ? "invoice" : "purchase order"}
            </Button>
          </div>
        </div>
        <div className={cn(pane === "edit" && "hidden lg:block")}>
          <Paper doc={doc} />
        </div>
      </div>

      <EmailDialog open={mailOpen} draft={mail} doc={doc} onChange={setMail} onClose={() => setMailOpen(false)} />
      <Modal open={confirmDelete} title="Delete this document?" onClose={() => setConfirmDelete(false)}>
        <p className="text-sm text-muted">
          {doc.number} will be removed from this browser. This does not email anyone.
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={remove}>
            Delete
          </Button>
          <Button onClick={() => setConfirmDelete(false)}>Keep it</Button>
        </div>
      </Modal>
    </div>
  );
}

function InvoiceFields({
  invoice,
  terms,
  onChange,
  onStatus,
}: {
  invoice: Invoice;
  terms: PaymentTerm[];
  onChange: (patch: Partial<Invoice>) => void;
  onStatus: (status: InvoiceStatus) => void;
}) {
  return (
    <section className="grid gap-4">
      <ChoiceRow value={invoice.status} options={INVOICE_STATUS} onChange={onStatus} />
      <p className="text-sm text-muted">Drafts stay off the outstanding total until you mark them unpaid.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Number">
          <Input value={invoice.number} onChange={(event) => onChange({ number: event.target.value })} />
        </Field>
        <Field label="Currency">
          <Select
            value={invoice.currency}
            onChange={(event) => onChange({ currency: event.target.value })}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Issued">
          <Input
            type="date"
            value={invoice.issueDate}
            onChange={(event) => {
              const issueDate = event.target.value;
              const term = terms.find((item) => item.id === invoice.termId);
              onChange({
                issueDate,
                dueDate: term ? addDaysISO(issueDate, term.days) : invoice.dueDate,
              });
            }}
          />
        </Field>
        <Field label="Due">
          <Input
            type="date"
            value={invoice.dueDate}
            onChange={(event) => onChange({ dueDate: event.target.value, termId: "" })}
          />
        </Field>
        <Field label="Billing terms" className="sm:col-span-2">
          <Select
            value={invoice.termId}
            onChange={(event) => {
              const termId = event.target.value;
              const term = terms.find((item) => item.id === termId);
              onChange({
                termId,
                dueDate: term ? addDaysISO(invoice.issueDate, term.days) : invoice.dueDate,
              });
            }}
          >
            <option value="">Custom due date</option>
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-3">
        <h2 className="font-display text-2xl tracking-tight">Client</h2>
        <Field label="Name">
          <Input
            value={invoice.client.name}
            autoComplete="organization"
            onChange={(event) => onChange({ client: { ...invoice.client, name: event.target.value } })}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={invoice.client.email}
            autoComplete="email"
            onChange={(event) => onChange({ client: { ...invoice.client, email: event.target.value } })}
          />
        </Field>
        <Field label="Address">
          <Textarea
            value={invoice.client.address}
            onChange={(event) => onChange({ client: { ...invoice.client, address: event.target.value } })}
          />
        </Field>
      </div>
    </section>
  );
}

function OrderFields({
  order,
  onChange,
  onStatus,
}: {
  order: PurchaseOrder;
  onChange: (patch: Partial<PurchaseOrder>) => void;
  onStatus: (status: PoStatus) => void;
}) {
  return (
    <section className="grid gap-4">
      <ChoiceRow value={order.status} options={ORDER_STATUS} onChange={onStatus} />
      <p className="text-sm text-muted">Open and scheduled orders land on the calendar by expected date.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Number">
          <Input value={order.number} onChange={(event) => onChange({ number: event.target.value })} />
        </Field>
        <Field label="Currency">
          <Select value={order.currency} onChange={(event) => onChange({ currency: event.target.value })}>
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Issued">
          <Input type="date" value={order.issueDate} onChange={(event) => onChange({ issueDate: event.target.value })} />
        </Field>
        <Field label="Expected">
          <Input
            type="date"
            value={order.expectedDate}
            onChange={(event) => onChange({ expectedDate: event.target.value })}
          />
        </Field>
      </div>
      <div className="grid gap-3">
        <h2 className="font-display text-2xl tracking-tight">Vendor</h2>
        <Field label="Name">
          <Input
            value={order.vendor.name}
            autoComplete="organization"
            onChange={(event) => onChange({ vendor: { ...order.vendor, name: event.target.value } })}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={order.vendor.email}
            autoComplete="email"
            onChange={(event) => onChange({ vendor: { ...order.vendor, email: event.target.value } })}
          />
        </Field>
        <Field label="Address">
          <Textarea
            value={order.vendor.address}
            onChange={(event) => onChange({ vendor: { ...order.vendor, address: event.target.value } })}
          />
        </Field>
        <Field label="Ship to" hint="Printed on the purchase order.">
          <Textarea value={order.shipTo} onChange={(event) => onChange({ shipTo: event.target.value })} />
        </Field>
      </div>
    </section>
  );
}
