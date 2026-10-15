import { createFileRoute } from "@tanstack/react-router";
import { ExactOrOutlet } from "../components/ExactOrOutlet";
import { MediaScreen } from "../screens/MediaScreen";

export const Route = createFileRoute("/media")({
  component: function MediaRoute() {
    return (
      <ExactOrOutlet path="/media">
        <MediaScreen />
      </ExactOrOutlet>
    );
  },
});
