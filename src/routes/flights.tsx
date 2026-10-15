import { createFileRoute } from "@tanstack/react-router";
import { ExactOrOutlet } from "../components/ExactOrOutlet";
import { FlightsScreen } from "../screens/FlightsScreen";

export const Route = createFileRoute("/flights")({
  component: function FlightsRoute() {
    return (
      <ExactOrOutlet path="/flights">
        <FlightsScreen />
      </ExactOrOutlet>
    );
  },
});
