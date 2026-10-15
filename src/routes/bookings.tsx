import { createFileRoute } from "@tanstack/react-router";
import { ExactOrOutlet } from "../components/ExactOrOutlet";
import { BookingsScreen } from "../screens/BookingsScreen";

export const Route = createFileRoute("/bookings")({
  component: function BookingsRoute() {
    return (
      <ExactOrOutlet path="/bookings">
        <BookingsScreen />
      </ExactOrOutlet>
    );
  },
});
