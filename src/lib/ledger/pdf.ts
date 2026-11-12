import { formatQty } from "@/lib/ledger/format";
import type { PresentedDoc } from "@/lib/ledger/present";
import type { jsPDF } from "jspdf";

type Doc = jsPDF;

const INK = [28, 29, 26] as const;
const MUTED = [92, 95, 89] as const;
const LINE = [227, 225, 216] as const;
const WASH = [243, 242, 238] as const;
const LEFT = 48;
const RIGHT = 564;
const WIDTH = RIGHT - LEFT;

function pdfSafe(value: string): string {
  return value
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u2022/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[^\t\n\r\x20-\xFF]/g, "");
}

function pdfMoney(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  if (currency === "USD") return `$${formatted}`;
  if (currency === "GBP") return `£${formatted}`;
  if (currency === "CAD") return `CA$${formatted}`;
  if (currency === "AUD") return `A$${formatted}`;
  if (currency === "NZD") return `NZ$${formatted}`;
  return `${currency} ${formatted}`;
}

function wrap(doc: Doc, text: string, width: number): string[] {
  const clean = pdfSafe(text).replace(/[ \t]+/g, " ").trim();
  if (!clean) return [];
  const raw = doc.splitTextToSize(clean, width) as string | string[];
  return Array.isArray(raw) ? raw : [raw];
}

function drawTableHeader(doc: Doc, y: number): number {
  doc.setFillColor(...INK);
  doc.rect(LEFT, y, WIDTH, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const baseline = y + 14;
  doc.text("Description", LEFT + 8, baseline);
  doc.text("Category", 276, baseline);
  doc.text("Qty", 416, baseline, { align: "right" });
  doc.text("Rate", 490, baseline, { align: "right" });
  doc.text("Amount", RIGHT - 8, baseline, { align: "right" });
  return y + 22;
}

function paintHeader(doc: Doc, model: PresentedDoc): number {
  doc.setFillColor(...INK);
  doc.rect(LEFT, 40, WIDTH, 4, "F");

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const nameLines = wrap(doc, model.companyName, 320);
  let y = 68;
  for (const line of nameLines.length ? nameLines : ["Your business"]) {
    doc.text(line, LEFT, y);
    y += 20;
  }

  doc.setFontSize(11);
  doc.text(model.kindLabel.toUpperCase(), RIGHT, 68, { align: "right" });
  doc.setFontSize(12);
  doc.text(pdfSafe(model.number), RIGHT, 86, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(pdfSafe(model.statusLabel), RIGHT, 102, { align: "right" });

  doc.setFontSize(9);
  let lineY = y;
  for (const line of model.companyLines) {
    const wrapped = wrap(doc, line, 300);
    for (const part of wrapped) {
      doc.text(part, LEFT, lineY);
      lineY += 12;
    }
  }

  y = Math.max(lineY, 116) + 10;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(1);
  doc.line(LEFT, y, RIGHT, y);
  y += 20;

  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(model.partyLabel.toUpperCase(), LEFT, y);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  y += 16;
  doc.text(pdfSafe(model.partyMissing ? model.partyLabel : model.partyName), LEFT, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const partyStart = y;
  for (const line of model.partyLines) {
    for (const part of wrap(doc, line, 250)) {
      doc.text(part, LEFT, y);
      y += 12;
    }
  }
  if (model.partyEmail) {
    doc.text(pdfSafe(model.partyEmail), LEFT, y);
    y += 12;
  }

  let factY = partyStart - 30;
  doc.setFontSize(9);
  for (const fact of model.facts) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(fact.label, 400, factY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(pdfSafe(fact.value), RIGHT, factY, { align: "right" });
    factY += 16;
  }

  y = Math.max(y, factY) + 8;

  if (model.shipTo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("SHIP TO", LEFT, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    for (const line of model.shipTo.split(/\n+/)) {
      for (const part of wrap(doc, line, WIDTH)) {
        doc.text(part, LEFT, y);
        y += 12;
      }
    }
    y += 6;
  }

  return y + 6;
}

export async function buildPdf(model: PresentedDoc): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  let y = paintHeader(doc, model);

  const ensure = (needed: number) => {
    if (y + needed <= 730) return;
    doc.addPage();
    y = 48;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text(pdfSafe(`${model.kindLabel} ${model.number}`), LEFT, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text("Continued", RIGHT, y, { align: "right" });
    y += 16;
    y = drawTableHeader(doc, y);
  };

  y = drawTableHeader(doc, y);

  model.rows.forEach((row, index) => {
    const desc = wrap(doc, row.description, 200);
    const cat = wrap(doc, row.category, 80);
    const lines = Math.max(desc.length, cat.length, 1);
    const rowH = lines * 12 + 10;
    ensure(rowH);
    if (index % 2 === 1) {
      doc.setFillColor(...WASH);
      doc.rect(LEFT, y, WIDTH, rowH, "F");
    }
    const baseline = y + 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    desc.forEach((line, i) => doc.text(line, LEFT + 8, baseline + i * 12));
    doc.setTextColor(...MUTED);
    cat.forEach((line, i) => doc.text(line, 276, baseline + i * 12));
    doc.setTextColor(...INK);
    doc.text(formatQty(row.quantity), 416, baseline, { align: "right" });
    doc.text(pdfMoney(row.unitPrice, model.currency), 490, baseline, { align: "right" });
    doc.text(pdfMoney(row.amount, model.currency), RIGHT - 8, baseline, { align: "right" });
    y += rowH;
  });

  if (model.rows.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text("No line items yet.", LEFT + 8, y + 16);
    y += 28;
  }

  ensure(80);
  y += 12;
  const totals: [string, string, boolean][] = [["Subtotal", pdfMoney(model.subtotal, model.currency), false]];
  if (model.taxEnabled) {
    const rate = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(model.taxRate);
    totals.push([`Tax ${rate}%`, pdfMoney(model.tax, model.currency), false]);
  }
  totals.push(["Total", pdfMoney(model.total, model.currency), true]);

  for (const [label, value, strong] of totals) {
    if (strong) {
      doc.setDrawColor(...INK);
      doc.setLineWidth(1);
      doc.line(380, y, RIGHT, y);
      y += 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    }
    doc.setTextColor(...MUTED);
    doc.text(label, 400, y);
    doc.setTextColor(...INK);
    doc.text(value, RIGHT, y, { align: "right" });
    y += strong ? 20 : 14;
  }

  const noteLines = model.notes
    .split(/\n/)
    .flatMap((paragraph) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return [""];
      return wrap(doc, trimmed, WIDTH);
    });
  const meaningful = noteLines.some((line) => line.trim());
  if (meaningful) {
    ensure(36);
    y += 8;
    doc.setDrawColor(...LINE);
    doc.line(LEFT, y, RIGHT, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("NOTES", LEFT, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    for (const line of noteLines) {
      ensure(14);
      if (line) doc.text(line, LEFT, y);
      y += 12;
    }
  }

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(pdfSafe(`${model.kindLabel} ${model.number}`), LEFT, 774);
    doc.text(`Page ${page} of ${pages}`, RIGHT, 774, { align: "right" });
  }

  return doc.output("blob");
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function sharePdf(blob: Blob, filename: string, title: string): Promise<"shared" | "unavailable" | "cancelled"> {
  const file = new File([blob], filename, { type: "application/pdf" });
  if (!navigator.canShare?.({ files: [file] })) return "unavailable";
  try {
    await navigator.share({ files: [file], title });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    throw error;
  }
}
