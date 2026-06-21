"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    panelRef.current?.focus();
  }, [open]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="animate-modal-overlay absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          "animate-modal-sheet relative z-10 flex w-full max-w-lg flex-col overflow-hidden border border-border bg-surface-raised shadow-elevated outline-none",
          "max-h-[100dvh] rounded-t-3xl sm:max-h-[min(90dvh,840px)] sm:rounded-3xl",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          className,
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:px-6">
          <div className="min-w-0 space-y-1">
            <h2
              id="modal-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              {title}
            </h2>
            {description ? (
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            ) : null}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-8 sm:px-6 sm:pb-8">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
