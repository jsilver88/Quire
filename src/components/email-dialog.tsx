import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { buildMail, openMailto, type MailDraft } from "@/lib/ledger/email";
import type { PresentedDoc } from "@/lib/ledger/present";
import { buildPdf, saveBlob, sharePdf } from "@/lib/ledger/pdf";

export function EmailDialog({
  open,
  draft,
  doc,
  onChange,
  onClose,
}: {
  open: boolean;
  draft: MailDraft | null;
  doc: PresentedDoc | null;
  onChange: (draft: MailDraft) => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  if (!draft || !doc) return null;

  async function download() {
    if (!doc) return;
    setBusy(true);
    try {
      const blob = await buildPdf(doc);
      saveBlob(blob, doc.filename);
      toast("PDF downloaded. Attach it in your email.");
    } catch {
      toast("Could not create the PDF.");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    if (!doc) return;
    setBusy(true);
    try {
      const blob = await buildPdf(doc);
      const result = await sharePdf(blob, doc.filename, `${doc.kindLabel} ${doc.number}`);
      if (result === "unavailable") {
        saveBlob(blob, doc.filename);
        toast("This browser cannot share files. The PDF was downloaded instead.");
      } else if (result === "shared") {
        toast("PDF shared.");
      }
    } catch {
      toast("Could not share the PDF.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`To: ${draft?.to ?? ""}\nSubject: ${draft?.subject ?? ""}\n\n${draft?.body ?? ""}`);
      toast("Message copied.");
    } catch {
      toast("Could not copy the message.");
    }
  }

  return (
    <Modal open={open} title="Email this document" onClose={onClose}>
      <p className="text-sm text-muted">
        This opens your email app with the summary filled in. Browsers cannot attach a file to that draft, so
        download the PDF and add it yourself. On a phone, Share PDF can hand the file to Mail.
      </p>
      <div className="mt-4 grid gap-3">
        <Field label="To">
          <Input
            type="email"
            value={draft.to}
            autoComplete="email"
            onChange={(event) => onChange({ ...draft, to: event.target.value })}
          />
        </Field>
        <Field label="Subject">
          <Input value={draft.subject} onChange={(event) => onChange({ ...draft, subject: event.target.value })} />
        </Field>
        <Field label="Message">
          <Textarea value={draft.body} onChange={(event) => onChange({ ...draft, body: event.target.value })} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy} onClick={() => openMailto(draft)}>
          Open email app
        </Button>
        <Button disabled={busy} onClick={() => void download()}>
          {busy ? "Preparing…" : "Download PDF"}
        </Button>
        <Button disabled={busy} onClick={() => void share()}>
          Share PDF
        </Button>
        <Button variant="ghost" onClick={() => void copy()}>
          Copy message
        </Button>
      </div>
    </Modal>
  );
}

export function mailFor(doc: PresentedDoc) {
  return buildMail(doc);
}
