import { createFileRoute } from "@tanstack/react-router";
import { LanguageScreen } from "../screens/LanguageScreen";

export const Route = createFileRoute("/profile/language")({
  component: LanguageScreen,
});
