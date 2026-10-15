import { createFileRoute } from "@tanstack/react-router";
import { GiftDetailScreen } from "../screens/GiftDetailScreen";

export const Route = createFileRoute("/gifts/$certId")({
  component: GiftDetailScreen,
});
