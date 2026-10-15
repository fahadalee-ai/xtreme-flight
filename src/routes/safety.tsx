import { createFileRoute } from "@tanstack/react-router";
import { SafetyScreen } from "../screens/SafetyScreen";

export const Route = createFileRoute("/safety")({
  component: SafetyScreen,
});
