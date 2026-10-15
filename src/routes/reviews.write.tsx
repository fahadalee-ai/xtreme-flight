import { createFileRoute } from "@tanstack/react-router";
import { WriteReviewScreen } from "../screens/WriteReviewScreen";

export const Route = createFileRoute("/reviews/write")({
  component: WriteReviewScreen,
});
