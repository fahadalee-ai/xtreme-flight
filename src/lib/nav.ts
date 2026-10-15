import { useCallback } from "react";
import { useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";

export function useGo() {
  const navigate = useNavigate();
  return useCallback((to: string) => navigate({ to: to as never }), [navigate]);
}

const PARENTS: Record<string, string> = {
  "/login": "/onboarding",
  "/register": "/welcome",
  "/forgot": "/login",
  "/welcome": "/onboarding",
  "/notify": "/home",
  "/book": "/home",
};

/** Where Back should go when browser history cannot move. */
export function parentOf(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (PARENTS[path]) return PARENTS[path];
  const rules: [string, string][] = [
    ["/profile/", "/profile"],
    ["/settings/", "/profile"],
    ["/flights/", "/flights"],
    ["/bookings/", "/bookings"],
    ["/media/", "/media"],
    ["/gifts/", "/gifts"],
    ["/reviews/", "/reviews"],
    ["/articles/", "/support"],
    ["/receipts/", "/profile/payments"],
    ["/weather/", "/bookings"],
  ];
  for (const [prefix, dest] of rules) {
    if (path.startsWith(prefix)) return dest;
  }
  return "/home";
}

/**
 * Leaves the current screen. History is tried first; if it does not move,
 * navigation falls back to the parent screen or Home so the user is never stuck.
 */
export function useBack() {
  const router = useRouter();
  const go = useGo();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return useCallback(
    (back?: boolean | string | (() => void)) => {
      if (typeof back === "function") {
        back();
        return;
      }
      if (typeof back === "string") {
        go(back);
        return;
      }
      const fallback = parentOf(pathname);
      const index = Number((router.state.location.state as { __TSR_index?: number } | undefined)?.__TSR_index ?? 0);
      if (index <= 0) {
        go(fallback);
        return;
      }
      const before = router.state.location.pathname;
      router.history.back();
      window.setTimeout(() => {
        if (router.state.location.pathname === before) go(fallback);
      }, 280);
    },
    [go, pathname, router],
  );
}

/** Sends guests and signed-out visitors to login, and remembers where they were headed. */
export function useAuthGate() {
  const app = useApp();
  const go = useGo();
  return (to: string) => {
    if (!app.user) {
      app.setRedirect(to);
      go("/login");
      return false;
    }
    go(to);
    return true;
  };
}
