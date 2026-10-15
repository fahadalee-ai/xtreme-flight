import { createFileRoute } from "@tanstack/react-router";
import { NotificationsScreen } from "../screens/NotificationsScreen";

export const Route = createFileRoute("/notifications")({
  component: NotificationsScreen,
});
