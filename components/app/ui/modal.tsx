"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./button";

/**
 * Bottom sheet on phones, centred dialog from sm up — the pattern the Stitch
 * mobile screens use. Focus is trapped for as long as it is open and returned to
 * whatever opened it on close.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>(
      "input, textarea, select, button, [href], [tabindex]:not([tabindex='-1'])",
    )?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:items-center sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative flex max-h-[90svh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl bg-surface-container-lowest shadow-xl sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
          <h2 id={titleId} className="font-headline text-lg font-bold tracking-tight text-on-surface">
            {title}
          </h2>
          <CloseButton onClose={onClose} />
        </div>
        <div className="overflow-y-auto px-6 pb-6">{children}</div>
        {footer ? (
          <div className="flex flex-col gap-2 border-t border-outline-variant/20 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={t("common.cancel")}
      className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant/50"
    >
      <span className="material-symbols-outlined">close</span>
    </button>
  );
}

/** Yes/no dialog used for destructive or irreversible actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  danger = false,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body?: string;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {body ? <p className="text-sm text-on-surface-variant">{body}</p> : null}
    </Modal>
  );
}
