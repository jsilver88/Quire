import { formatQty, money } from "@/lib/ledger/format";
import type { PresentedDoc } from "@/lib/ledger/present";

export type MailDraft = {
  to: string;
  subject: string;
  body: string;
};

function totalLines(doc: PresentedDoc): { label: string; value: string }[] {
  const lines = [{ label: "Subtotal", value: money(doc.subtotal, doc.currency) }];
  if (doc.taxEnabled) {
    lines.push({
      label: `Tax ${trimRate(doc.taxRate)}%`,
      value: money(doc.tax, doc.currency),
    });
  }
  lines.push({ label: "Total", value: money(doc.total, doc.currency) });
  return lines;
}

function trimRate(rate: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rate);
}

export function buildMail(doc: PresentedDoc): MailDraft {
  const lines = [
    `${doc.kindLabel} ${doc.number}`,
    `From: ${doc.companyName}`,
    `${doc.partyLabel}: ${doc.partyMissing ? "(not set)" : doc.partyName}`,
    "",
    ...doc.facts.map((fact) => `${fact.label}: ${fact.value}`),
    `Status: ${doc.statusLabel}`,
    "",
    "Items:",
    ...doc.rows.map(
      (row) =>
        `- ${row.description} (${row.category})  ${formatQty(row.quantity)} x ${money(row.unitPrice, doc.currency)} = ${money(row.amount, doc.currency)}`,
    ),
    "",
    ...totalLines(doc).map((line) => `${line.label}: ${line.value}`),
    "",
  ];
  if (doc.shipTo) {
    lines.push("Ship to:", doc.shipTo, "");
  }
  if (doc.notes.trim()) {
    lines.push("Notes:", doc.notes.trim(), "");
  }
  lines.push("A PDF of this document is ready to attach.");
  const body = lines.join("\n");
  const subject = `${doc.kindLabel} ${doc.number} from ${doc.companyName}`;
  return {
    to: doc.partyEmail,
    subject,
    body: body.length > 1800 ? `${body.slice(0, 1750)}\n\n...` : body,
  };
}

export function openMailto(draft: MailDraft) {
  const href = `mailto:${encodeURIComponent(draft.to)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  window.location.href = href;
}
