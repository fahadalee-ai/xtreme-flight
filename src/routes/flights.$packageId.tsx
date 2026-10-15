import { createFileRoute } from "@tanstack/react-router";
import { PackageDetailScreen } from "../screens/PackageDetailScreen";

export const Route = createFileRoute("/flights/$packageId")({
  component: PackageDetailScreen,
});
