import { createFileRoute } from "@tanstack/react-router";
import { TermsScreen } from "../screens/TermsScreen";

export const Route = createFileRoute("/profile/terms")({
  component: TermsScreen,
});
