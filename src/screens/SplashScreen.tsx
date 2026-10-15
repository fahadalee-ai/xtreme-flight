import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { images } from "@/img/images";
import { TAGLINE } from "@/data/content";
import { useApp } from "@/store/app-store";

export function SplashScreen() {
  const { hydrated } = useApp();
  const navigate = useNavigate();
  const started = useRef(Date.now());

  useEffect(() => {
    if (!hydrated) return;
    const wait = Math.max(400, 2700 - (Date.now() - started.current));
    const timer = window.setTimeout(() => {
      navigate({ to: "/onboarding", replace: true });
    }, wait);
    return () => window.clearTimeout(timer);
  }, [hydrated, navigate]);

  return (
    <div className="on-media relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-ink px-8 text-white">
      <div className="speed-lines pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/15 blur-3xl" />
      <div className="relative">
        <img src={images.logoOnDark} alt="Xtreme Flight" className="splash-logo logo-knockout h-28 w-auto" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 overflow-hidden">
          <div className="splash-sweep h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>
      <p className="splash-tag relative mt-8 text-center text-[13px] uppercase tracking-[0.18em] text-[#d1d5db]">{TAGLINE}</p>
      <div className="splash-bar absolute inset-x-10 bottom-[max(28px,env(safe-area-inset-bottom))] h-1 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full bg-lime" />
      </div>
    </div>
  );
}
