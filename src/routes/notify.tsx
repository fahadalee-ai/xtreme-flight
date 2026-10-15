import { createFileRoute } from "@tanstack/react-router";
import { NotifyPromptScreen } from "../screens/NotifyPromptScreen";

export const Route = createFileRoute("/notify")({
  component: NotifyPromptScreen,
});
