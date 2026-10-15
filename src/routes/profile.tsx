import { createFileRoute } from "@tanstack/react-router";
import { ExactOrOutlet } from "../components/ExactOrOutlet";
import { ProfileScreen } from "../screens/ProfileScreen";

export const Route = createFileRoute("/profile")({
  component: function ProfileRoute() {
    return (
      <ExactOrOutlet path="/profile">
        <ProfileScreen />
      </ExactOrOutlet>
    );
  },
});
