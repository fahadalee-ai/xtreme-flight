import { createFileRoute } from "@tanstack/react-router";
import { GiftBuyScreen } from "../screens/GiftBuyScreen";

export const Route = createFileRoute("/gifts/buy")({
  component: GiftBuyScreen,
});
