import { createFileRoute } from "@tanstack/react-router";
import { EventsScreen } from "../screens/EventsScreen";

export const Route = createFileRoute("/events")({
  component: EventsScreen,
});
