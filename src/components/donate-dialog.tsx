"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { ExternalLink, Heart, X } from "lucide-react";

// Set NEXT_PUBLIC_DONATE_URL in .env.local to change the donate page.
const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL || "https://ezdn.app/artkits";

type DonateCopy = {
  title: string;
  body: readonly string[];
  cta: string;
  newTab: string;
  later: string;
  note: string;
  close: string;
};

type DonateDialogProps = {
  copy: DonateCopy;
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export function DonateDialog({ copy, open, onClose, returnFocusRef }: DonateDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleId = useId();

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Open or close the native dialog. showModal() moves focus inside it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  function close() { dialogRef.current?.close(); }

  return (
    <dialog
      ref={dialogRef}
      className="donate-dialog"
      aria-labelledby={titleId}
      // The "close" event fires for Esc, the X button, the backdrop and "Maybe later".
      onClose={() => { onClose(); returnFocusRef.current?.focus(); }}
      // The dialog has no padding, so a click on the dialog itself is a click on the backdrop.
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="donate-body">
        <button type="button" className="donate-close" onClick={close} aria-label={copy.close} title={copy.close}>
          <X size={20} aria-hidden="true" />
        </button>
        <span className="donate-heart"><Heart size={26} aria-hidden="true" /></span>
        <h2 id={titleId}>{copy.title}</h2>
        {copy.body.map((text) => <p key={text}>{text}</p>)}
        <a className="donate-cta" href={donateUrl} target="_blank" rel="noopener noreferrer">
          {copy.cta} <ExternalLink size={18} aria-hidden="true" /><span className="sr-only">{copy.newTab}</span>
        </a>
        <button type="button" className="donate-later" onClick={close}>{copy.later}</button>
        <small className="donate-note">{copy.note}</small>
      </div>
    </dialog>
  );
}
