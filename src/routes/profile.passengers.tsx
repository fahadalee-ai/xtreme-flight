import { createFileRoute } from "@tanstack/react-router";
import { PassengersScreen } from "../screens/PassengersScreen";

export const Route = createFileRoute("/profile/passengers")({
  component: PassengersScreen,
});
