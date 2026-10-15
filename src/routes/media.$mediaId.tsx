import { createFileRoute } from "@tanstack/react-router";
import { MediaViewerScreen } from "../screens/MediaViewerScreen";

export const Route = createFileRoute("/media/$mediaId")({
  component: MediaViewerScreen,
});
