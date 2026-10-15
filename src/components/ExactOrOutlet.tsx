import type { ReactNode } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";

/** Parent file-routes also wrap nested URLs. Show the screen only on the exact path. */
export function ExactOrOutlet({ path, children }: { path: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== path && pathname !== `${path}/`) return <Outlet />;
  return children;
}
