import { createFileRoute } from "@tanstack/react-router";
import { PaymentsScreen } from "../screens/PaymentsScreen";

export const Route = createFileRoute("/profile/payments")({
  component: PaymentsScreen,
});
