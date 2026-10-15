import { createFileRoute } from "@tanstack/react-router";
import { KidsScreen } from "../screens/KidsScreen";

export const Route = createFileRoute("/kids")({
  component: KidsScreen,
});
