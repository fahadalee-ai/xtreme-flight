import { createFileRoute } from "@tanstack/react-router";
import { ExactOrOutlet } from "../components/ExactOrOutlet";
import { GiftsScreen } from "../screens/GiftsScreen";

export const Route = createFileRoute("/gifts")({
  component: function GiftsRoute() {
    return (
      <ExactOrOutlet path="/gifts">
        <GiftsScreen />
      </ExactOrOutlet>
    );
  },
});
