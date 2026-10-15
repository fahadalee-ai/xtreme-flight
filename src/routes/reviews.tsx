import { createFileRoute } from "@tanstack/react-router";
import { ExactOrOutlet } from "../components/ExactOrOutlet";
import { ReviewsScreen } from "../screens/ReviewsScreen";

export const Route = createFileRoute("/reviews")({
  component: function ReviewsRoute() {
    return (
      <ExactOrOutlet path="/reviews">
        <ReviewsScreen />
      </ExactOrOutlet>
    );
  },
});
