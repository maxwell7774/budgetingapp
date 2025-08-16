import { ReactNode, useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Open / close based on the `open` prop
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (open) {
      if (!element.open) {
        element.showModal();
      }
    } else {
      if (element.open) {
        element.close();
      }
    }
  }, [open]);

  // Close when user clicks outside or presses Esc
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClose = () => {
      onClose();
    };

    element.addEventListener("close", handleClose);
    return () => {
      element.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-6 shadow-2xl backdrop:bg-black/50"
    >
      {children}
    </dialog>
  );
}
