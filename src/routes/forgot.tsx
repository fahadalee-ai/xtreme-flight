import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";

export const Route = createFileRoute("/forgot")({
  component: ForgotPasswordScreen,
});
