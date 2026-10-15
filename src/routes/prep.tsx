import { createFileRoute } from "@tanstack/react-router";
import { PrepScreen } from "../screens/PrepScreen";

export const Route = createFileRoute("/prep")({
  component: PrepScreen,
});
