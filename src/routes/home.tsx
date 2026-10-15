import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "../screens/HomeScreen";

export const Route = createFileRoute("/home")({
  component: HomeScreen,
});
