import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettingsScreen } from "../screens/NotificationSettingsScreen";

export const Route = createFileRoute("/settings/notifications")({
  component: NotificationSettingsScreen,
});
