import { createFileRoute } from "@tanstack/react-router";
import { ArticleScreen } from "../screens/ArticleScreen";

export const Route = createFileRoute("/articles/$slug")({
  component: ArticleScreen,
});
