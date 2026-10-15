import { createFileRoute } from "@tanstack/react-router";
import { PrivacyScreen } from "../screens/PrivacyScreen";

export const Route = createFileRoute("/profile/privacy")({
  component: PrivacyScreen,
});
