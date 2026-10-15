import { createFileRoute } from "@tanstack/react-router";
import { WeatherScreen } from "../screens/WeatherScreen";

export const Route = createFileRoute("/weather/$bookingId")({
  component: WeatherScreen,
});
