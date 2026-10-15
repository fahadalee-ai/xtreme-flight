import { createFileRoute } from "@tanstack/react-router";
import { PersonalInfoScreen } from "../screens/PersonalInfoScreen";

export const Route = createFileRoute("/profile/info")({
  component: PersonalInfoScreen,
});
