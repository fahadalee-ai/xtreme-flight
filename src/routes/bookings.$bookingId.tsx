import { createFileRoute } from "@tanstack/react-router";
import { BookingDetailScreen } from "../screens/BookingDetailScreen";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: BookingDetailScreen,
});
