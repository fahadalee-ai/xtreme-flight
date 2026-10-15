import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "../screens/SplashScreen";

export const Route = createFileRoute("/")({
  component: SplashScreen,
});
