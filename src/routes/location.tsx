import { createFileRoute } from "@tanstack/react-router";
import { LocationScreen } from "../screens/LocationScreen";

export const Route = createFileRoute("/location")({
  component: LocationScreen,
});
