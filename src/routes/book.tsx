import { createFileRoute } from "@tanstack/react-router";
import { BookingFlowScreen } from "../screens/BookingFlowScreen";

export const Route = createFileRoute("/book")({
  component: BookingFlowScreen,
});
