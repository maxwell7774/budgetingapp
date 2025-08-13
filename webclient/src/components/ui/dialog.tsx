/*
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./index.ts";

interface Props {
  children: ReactNode;
}

export function Dialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && render) {
      const timer = setTimeout(() => setRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpen = function () {
    setRender(true);
    requestAnimationFrame(() => setOpen(true));
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open</Button>
      {render &&
        (
          <div
            data-open={open}
            className="fixed inset-0 z-[999] isolate bg-slate-950 opacity-70"
          >
            <div
              data-open={open}
              className="bg-white dark:bg-slate-800 max-w-7xl mx-auto mt-auto min-h-96"
            >
            </div>
          </div>
        )}
    </div>
  );
}
*/

import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./index.ts";

interface Props {
  triggerLabel?: string;
  children: ReactNode;
}

export function Dialog({ triggerLabel = "Open Dialog", children }: Props) {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Handle unmount after close animation
  useEffect(() => {
    if (!open && render) {
      const timer = setTimeout(() => setRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open, render]);

  // Focus management and Escape key
  useEffect(() => {
    if (open && dialogRef.current) {
      const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      firstFocusable?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
        // Simple focus trap
        if (e.key === "Tab" && dialogRef.current) {
          const focusableEls = Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
            ),
          );
          if (focusableEls.length === 0) return;

          const first = focusableEls[0];
          const last = focusableEls[focusableEls.length - 1];

          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    } else if (!open && triggerRef.current) {
      triggerRef.current.focus(); // Return focus to trigger
    }
  }, [open]);

  const handleOpen = () => {
    setRender(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button ref={triggerRef} onClick={handleOpen}>
        {triggerLabel}
      </Button>

      {render && (
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center transition-colors duration-200 ${
            open ? "bg-slate-950/70" : "bg-slate-950/0"
          }`}
          onClick={handleClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-slate-800 max-w-lg w-full rounded-lg shadow-lg p-6 transform transition-all duration-200 ${
              open ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {children}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
