import { createFileRoute } from "@tanstack/react-router";
import { EligibilityScreen } from "../screens/EligibilityScreen";

export const Route = createFileRoute("/eligibility")({
  component: EligibilityScreen,
});
