import { CalendarCheck, Clapperboard, House, Plane, UserRound } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";
import { useAuthGate, useGo } from "@/lib/nav";

const tabs = [
  { to: "/home", key: "home" as const, icon: House },
  { to: "/flights", key: "flights" as const, icon: Plane },
  { to: "/bookings", key: "bookings" as const, icon: CalendarCheck },
  { to: "/media", key: "media" as const, icon: Clapperboard },
  { to: "/profile", key: "profile" as const, icon: UserRound },
];

export function tabRoots(pathname: string) {
  return tabs.some((t) => pathname === t.to);
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const go = useGo();
  const gate = useAuthGate();
  const { t } = useApp();
  if (!tabRoots(pathname)) return null;

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-line bg-background/92 backdrop-blur-xl" aria-label="Primary">
      <div className="grid grid-cols-5 px-1 py-3">
        {tabs.map((tab) => {
          const active = pathname === tab.to;
          const Icon = tab.icon;
          return (
            <button
              key={tab.to}
              type="button"
              onClick={() => (tab.to === "/media" ? gate("/media") : go(tab.to))}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 text-[10px] leading-3 ${active ? "text-lime" : "text-muted-foreground"}`}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
              {t(tab.key)}
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

export function BookFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const gate = useAuthGate();
  const { t } = useApp();
  if (pathname !== "/home" && pathname !== "/flights") return null;
  return (
    <button
      type="button"
      onClick={() => gate("/book")}
      className="press absolute bottom-[calc(76px+env(safe-area-inset-bottom)+16px)] left-1/2 z-40 flex h-[50px] -translate-x-1/2 items-center gap-2 rounded-full bg-lime px-5 text-[17px] font-semibold text-ink"
    >
      <Plane size={18} />
      {t("book")}
    </button>
  );
}
