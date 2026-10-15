import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const scroller = document.querySelector(".xf-scroll") as HTMLElement | null;
    const prev = scroller?.style.overflow;
    if (scroller) scroller.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      if (scroller) scroller.style.overflow = prev || "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  const host = document.getElementById("xf-overlay");
  if (!host) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="pointer-events-auto absolute inset-0 z-50 flex flex-col justify-end">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-h-[86%] overflow-y-auto rounded-t-[12px] border-x-0 border-b-0 border-t border-white/12 bg-elevated px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20" />
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-sans text-[17px] font-semibold leading-[22px] tracking-[-0.02em]">{title}</h2>
              <button type="button" aria-label="Close sheet" onClick={onClose} className="press flex h-11 w-11 items-center justify-center">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    host,
  );
}
