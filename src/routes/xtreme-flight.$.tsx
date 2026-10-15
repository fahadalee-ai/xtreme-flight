import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/xtreme-flight/$")({
  beforeLoad: ({ location }) => {
    const next = location.href.replace(/^\/xtreme-flight\/?/, "/");
    throw redirect({ href: next.startsWith("/") ? next : `/${next}`, replace: true });
  },
});
