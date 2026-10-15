import { ChevronLeft } from "lucide-react";
import { images } from "@/img/images";
import { HERO, TAGLINE } from "@/data/content";
import { Button } from "@/components/chrome";
import { useApp } from "@/store/app-store";
import { useGo } from "@/lib/nav";

export function WelcomeScreen() {
  const go = useGo();
  const { continueAsGuest, markOnboarded, t } = useApp();
  return (
    <div className="on-media relative flex flex-1 flex-col text-white">
      <img src={images.xa42Flight} alt="XA-42 in flight" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/70 to-[#111827]/30" />
      <button type="button" className="ios-back absolute left-2 top-[env(safe-area-inset-top)] z-10" onClick={() => go("/onboarding")}>
        <ChevronLeft size={28} strokeWidth={2.25} />
        Back
      </button>
      <div className="relative flex flex-1 flex-col justify-end px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <img src={images.logoOnDark} alt="Xtreme Flight" className="logo-knockout mb-4 h-16 w-auto self-start" />
        <h1 className="font-display text-[32px] uppercase leading-9">{HERO}</h1>
        <p className="mt-2 text-[13px] uppercase tracking-[0.16em] text-[#d1d5db]">{TAGLINE}</p>
        <div className="mt-6 space-y-3">
          <Button onClick={() => go("/login")}>{t("login")}</Button>
          <Button variant="outline" onClick={() => go("/register")}>
            {t("create")}
          </Button>
          <button
            type="button"
            className="min-h-11 w-full text-[14px] text-[#d1d5db]"
            onClick={() => {
              markOnboarded();
              continueAsGuest();
              go("/home");
            }}
          >
            {t("guest")}
          </button>
        </div>
      </div>
    </div>
  );
}
