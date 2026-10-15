import { createFileRoute } from "@tanstack/react-router";
import { CrewScreen } from "../screens/CrewScreen";

export const Route = createFileRoute("/crew")({
  component: CrewScreen,
});
