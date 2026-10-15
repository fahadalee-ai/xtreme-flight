import { createFileRoute } from "@tanstack/react-router";
import { FaqScreen } from "../screens/FaqScreen";

export const Route = createFileRoute("/faq")({
  component: FaqScreen,
});
