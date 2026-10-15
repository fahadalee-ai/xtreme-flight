import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { BookFab, BottomNav } from "./BottomNav";
import { useApp } from "@/store/app-store";
import { useGo } from "@/lib/nav";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toasts, dismissToast, banner, dismissBanner } = useApp();
  const go = useGo();
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="xf-stage">
      <div className="xf-device">
        <div ref={scrollRef} className="xf-scroll no-scrollbar">
          <div key={pathname} className="page-in min-h-full">
            {children}
          </div>
        </div>
        <BottomNav />
        <BookFab />
        {!online ? (
          <div className="absolute inset-x-0 top-0 z-40 bg-danger px-4 py-2 text-center text-[12px] font-semibold text-ink">
            You're offline. Lists may not refresh until the connection returns.
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex flex-col gap-2 p-3 pt-[max(12px,env(safe-area-inset-top))]">
          {banner ? (
            <button
              type="button"
              className="pointer-events-auto card flex items-start gap-3 p-3 text-left shadow-lg"
              onClick={() => {
                dismissBanner();
                go("/media");
              }}
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-lime" />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold">{banner.title}</span>
                <span className="block text-[12px] leading-4 text-[#9ca3af]">{banner.body}</span>
              </span>
              <span
                className="press flex h-8 w-8 items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissBanner();
                }}
              >
                <X size={14} />
              </span>
            </button>
          ) : null}
          {toasts.map((toast) => (
            <button
              key={toast.id}
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto rounded-[14px] border border-lime/30 bg-[#1a2214] px-3 py-3 text-left shadow-lg"
            >
              <span className="block text-[14px] font-semibold text-lime">{toast.title}</span>
              {toast.body ? <span className="block text-[12px] leading-4 text-[#d1d5db]">{toast.body}</span> : null}
            </button>
          ))}
        </div>
        <div id="xf-overlay" className="pointer-events-none absolute inset-0 z-50" />
      </div>
    </div>
  );
}
