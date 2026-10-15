import { createFileRoute } from "@tanstack/react-router";
import { RegisterScreen } from "../screens/RegisterScreen";

export const Route = createFileRoute("/register")({
  component: RegisterScreen,
});
