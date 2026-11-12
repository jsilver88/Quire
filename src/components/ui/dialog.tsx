import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-shade fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="dialog-pop fixed inset-x-4 top-8 bottom-8 z-50 mx-auto max-w-xl overflow-y-auto rounded-2xl bg-paper p-4 text-ink shadow-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:inset-x-0">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="font-display text-2xl tracking-tight">{title}</Dialog.Title>
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center rounded-sm text-muted hover:bg-wash"
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
