import { createFileRoute } from "@tanstack/react-router";
import { SupportScreen } from "../screens/SupportScreen";

export const Route = createFileRoute("/support")({
  component: SupportScreen,
});
