import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/xtreme-flight")({
  beforeLoad: ({ location }) => {
    throw redirect({ href: location.href.replace(/^\/xtreme-flight\/?/, "/") || "/", replace: true });
  },
});
