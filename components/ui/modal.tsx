"use client";

import { useEffect, useRef, useState } from "react";

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

const EXIT_MS = 220;

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      let visibleFrame = 0;
      const mountFrame = requestAnimationFrame(() => {
        setMounted(true);
        visibleFrame = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(mountFrame);
        cancelAnimationFrame(visibleFrame);
      };
    }

    const hideFrame = requestAnimationFrame(() => setVisible(false));
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => {
      cancelAnimationFrame(hideFrame);
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4",
        visible ? "modal-root--visible" : "modal-root--hidden",
      )}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className={cn(
          "modal-overlay absolute inset-0 bg-foreground/20 backdrop-blur-[2px]",
          visible ? "modal-overlay--visible" : "modal-overlay--hidden",
        )}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "modal-panel relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-surface-raised shadow-elevated sm:rounded-3xl",
          visible ? "modal-panel--visible" : "modal-panel--hidden",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:px-6">
          <div className="space-y-1">
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

        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
