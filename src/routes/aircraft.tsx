import { createFileRoute } from "@tanstack/react-router";
import { AircraftScreen } from "../screens/AircraftScreen";

export const Route = createFileRoute("/aircraft")({
  component: AircraftScreen,
});
