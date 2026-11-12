import { Button } from "@/components/ui/button";
import { DecimalInput, Field, Input, Select } from "@/components/ui/fields";
import { blankLine, categoriesFor, lineAmount } from "@/lib/ledger/calc";
import { money } from "@/lib/ledger/format";
import type { Category, DocKind, LineItem } from "@/lib/ledger/types";

export function LineItems({
  kind,
  items,
  categories,
  currency,
  onChange,
}: {
  kind: DocKind;
  items: LineItem[];
  categories: Category[];
  currency: string;
  onChange: (items: LineItem[]) => void;
}) {
  const options = categoriesFor(categories, kind);

  function update(id: string, patch: Partial<LineItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-line bg-paper p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Description" className="sm:col-span-2">
              <Input
                value={item.description}
                placeholder="What this line is for"
                onChange={(event) => update(item.id, { description: event.target.value })}
              />
            </Field>
            <Field label="Category">
              <Select
                value={item.categoryId}
                onChange={(event) => update(item.id, { categoryId: event.target.value })}
              >
                <option value="">Uncategorized</option>
                {options.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Qty">
              <DecimalInput
                label={`Quantity for line ${index + 1}`}
                value={item.quantity}
                onValueChange={(quantity) => update(item.id, { quantity })}
              />
            </Field>
            <Field label="Rate">
              <DecimalInput
                label={`Rate for line ${index + 1}`}
                value={item.unitPrice}
                onValueChange={(unitPrice) => update(item.id, { unitPrice })}
              />
            </Field>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-faint">Amount</p>
                <p className="text-sm font-medium tabular-nums">{money(lineAmount(item), currency)}</p>
              </div>
              <Button variant="ghost" onClick={() => onChange(items.filter((row) => row.id !== item.id))}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...items, blankLine(categories, kind)])}>
        Add line
      </Button>
    </div>
  );
}
