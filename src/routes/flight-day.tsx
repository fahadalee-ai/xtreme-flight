import { createFileRoute } from "@tanstack/react-router";
import { FlightDayScreen } from "../screens/FlightDayScreen";

export const Route = createFileRoute("/flight-day")({
  component: FlightDayScreen,
});
