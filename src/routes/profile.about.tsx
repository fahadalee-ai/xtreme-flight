import { createFileRoute } from "@tanstack/react-router";
import { AboutScreen } from "../screens/AboutScreen";

export const Route = createFileRoute("/profile/about")({
  component: AboutScreen,
});
