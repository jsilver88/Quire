import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { DecimalInput, Field, Input, Select, Textarea } from "@/components/ui/fields";
import { useLedger } from "@/lib/ledger/store";
import { CURRENCIES, type AppliesTo } from "@/lib/ledger/types";

export function SettingsPanel() {
  const company = useLedger((state) => state.company);
  const categories = useLedger((state) => state.categories);
  const terms = useLedger((state) => state.terms);
  const updateCompany = useLedger((state) => state.updateCompany);
  const addCategory = useLedger((state) => state.addCategory);
  const updateCategory = useLedger((state) => state.updateCategory);
  const removeCategory = useLedger((state) => state.removeCategory);
  const addTerm = useLedger((state) => state.addTerm);
  const updateTerm = useLedger((state) => state.updateTerm);
  const removeTerm = useLedger((state) => state.removeTerm);
  const loadSample = useLedger((state) => state.loadSample);
  const clearDocuments = useLedger((state) => state.clearDocuments);
  const [categoryName, setCategoryName] = useState("");
  const [appliesTo, setAppliesTo] = useState<AppliesTo>("both");
  const [termName, setTermName] = useState("");
  const [termDays, setTermDays] = useState("30");
  const [confirm, setConfirm] = useState<"clear" | "sample" | null>(null);

  function addNewCategory() {
    const name = categoryName.trim();
    if (!name) return;
    addCategory(name, appliesTo);
    setCategoryName("");
  }

  function addNewTerm() {
    const name = termName.trim();
    const days = Number(termDays);
    if (!name || !Number.isFinite(days)) return;
    addTerm(name, Math.max(0, Math.min(365, Math.round(days))));
    setTermName("");
    setTermDays("30");
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-4xl tracking-tight">Settings</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Quire keeps your books in this browser only. They are not uploaded to an account. Download a PDF when you
          need a copy somewhere else.
        </p>
      </div>

      <section className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl tracking-tight">Business</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <Input value={company.name} onChange={(event) => updateCompany({ name: event.target.value })} />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={company.email}
              onChange={(event) => updateCompany({ email: event.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input value={company.phone} onChange={(event) => updateCompany({ phone: event.target.value })} />
          </Field>
          <Field label="Tax ID">
            <Input value={company.taxId} onChange={(event) => updateCompany({ taxId: event.target.value })} />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <Textarea value={company.address} onChange={(event) => updateCompany({ address: event.target.value })} />
          </Field>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl tracking-tight">Numbering and tax</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Currency" hint="Used on new documents.">
            <Select value={company.currency} onChange={(event) => updateCompany({ currency: event.target.value })}>
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Default tax rate" hint="New documents start with tax on when this is above zero.">
            <DecimalInput
              label="Default tax rate"
              max={100}
              value={company.defaultTaxRate}
              onValueChange={(defaultTaxRate) => updateCompany({ defaultTaxRate })}
            />
          </Field>
          <Field label="Invoice prefix" hint={`Next invoice will be ${company.invoicePrefix}${company.nextInvoice}`}>
            <Input
              value={company.invoicePrefix}
              onChange={(event) => updateCompany({ invoicePrefix: event.target.value })}
            />
          </Field>
          <Field label="Next invoice number">
            <Input
              inputMode="numeric"
              value={String(company.nextInvoice)}
              onChange={(event) => {
                const next = Number(event.target.value.replace(/[^\d]/g, ""));
                updateCompany({ nextInvoice: next > 0 ? next : 1 });
              }}
            />
          </Field>
          <Field label="PO prefix" hint={`Next order will be ${company.poPrefix}${company.nextPo}`}>
            <Input value={company.poPrefix} onChange={(event) => updateCompany({ poPrefix: event.target.value })} />
          </Field>
          <Field label="Next PO number">
            <Input
              inputMode="numeric"
              value={String(company.nextPo)}
              onChange={(event) => {
                const next = Number(event.target.value.replace(/[^\d]/g, ""));
                updateCompany({ nextPo: next > 0 ? next : 1 });
              }}
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl tracking-tight">Categories</h2>
        <p className="text-sm text-muted">These are the options on each invoice and purchase-order line.</p>
        <ul className="grid gap-3">
          {categories.map((category) => (
            <li key={category.id} className="flex flex-col gap-2 md:flex-row md:items-center">
              <Input
                className="md:flex-1"
                aria-label={`Category name ${category.name}`}
                value={category.name}
                onChange={(event) => updateCategory(category.id, { name: event.target.value })}
              />
              <Select
                className="md:w-56"
                aria-label={`Where ${category.name} applies`}
                value={category.appliesTo}
                onChange={(event) => updateCategory(category.id, { appliesTo: event.target.value as AppliesTo })}
              >
                <option value="both">Invoices and orders</option>
                <option value="invoice">Invoices only</option>
                <option value="order">Purchase orders only</option>
              </Select>
              <Button variant="ghost" onClick={() => removeCategory(category.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            className="md:flex-1"
            aria-label="New category name"
            placeholder="New category"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
          />
          <Select className="md:w-56" aria-label="New category applies to" value={appliesTo} onChange={(event) => setAppliesTo(event.target.value as AppliesTo)}>
            <option value="both">Invoices and orders</option>
            <option value="invoice">Invoices only</option>
            <option value="order">Purchase orders only</option>
          </Select>
          <Button onClick={addNewCategory}>Add category</Button>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl tracking-tight">Billing terms</h2>
        <p className="text-sm text-muted">Choosing a term sets the invoice due date from the issue date.</p>
        <ul className="grid gap-3">
          {terms.map((term) => (
            <li key={term.id} className="flex flex-col gap-2 md:flex-row md:items-center">
              <Input
                className="md:flex-1"
                aria-label={`Term name ${term.name}`}
                value={term.name}
                onChange={(event) => updateTerm(term.id, { name: event.target.value })}
              />
              <Input
                className="md:w-32"
                aria-label={`Days for ${term.name}`}
                inputMode="numeric"
                value={String(term.days)}
                onChange={(event) => {
                  const days = Number(event.target.value.replace(/[^\d]/g, ""));
                  updateTerm(term.id, { days: Number.isFinite(days) ? Math.min(365, days) : 0 });
                }}
              />
              <Button variant="ghost" onClick={() => removeTerm(term.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            className="md:flex-1"
            aria-label="New term name"
            placeholder="Net 60"
            value={termName}
            onChange={(event) => setTermName(event.target.value)}
          />
          <Input
            className="md:w-32"
            aria-label="New term days"
            inputMode="numeric"
            value={termDays}
            onChange={(event) => setTermDays(event.target.value.replace(/[^\d]/g, "").slice(0, 3))}
          />
          <Button onClick={addNewTerm}>Add term</Button>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl tracking-tight">Books</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setConfirm("sample")}>Restore sample books</Button>
          <Button variant="danger" onClick={() => setConfirm("clear")}>
            Remove all documents
          </Button>
        </div>
      </section>

      <Modal
        open={confirm !== null}
        title={confirm === "sample" ? "Restore the sample?" : "Remove every document?"}
        onClose={() => setConfirm(null)}
      >
        <p className="text-sm text-muted">
          {confirm === "sample"
            ? "This replaces the current invoices and purchase orders with the Northline Atelier sample. Your business profile is replaced too."
            : "Invoices and purchase orders will be deleted from this browser. Your business profile, categories, and billing terms stay."}
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant={confirm === "clear" ? "danger" : "primary"}
            onClick={() => {
              if (confirm === "sample") {
                loadSample();
                toast("Sample books restored.");
              } else {
                clearDocuments();
                toast("Documents removed.");
              }
              setConfirm(null);
            }}
          >
            {confirm === "sample" ? "Restore sample" : "Remove documents"}
          </Button>
          <Button onClick={() => setConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
