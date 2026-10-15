import { useParams } from "@tanstack/react-router";
import { articles } from "@/data/content";
import { ErrorBlock, Header, Screen } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { api } from "@/services/api";
import { useLoad } from "@/services/use-load";

export function ArticleScreen() {
  const { slug } = useParams({ from: "/articles/$slug" });
  const q = useLoad(() => api.article(slug), [slug]);
  const article = q.data || articles.find((a) => a.slug === slug);
  if (q.status === "loading" && !article) return <SkeletonPage />;
  if (!article) {
    return (
      <Screen>
        <Header title="Article" />
        <ErrorBlock message="That article is missing." onRetry={q.retry} />
      </Screen>
    );
  }
  return (
    <Screen>
      <Header title="Help" />
      <article className="px-4">
        <p className="text-[12px] uppercase tracking-wide text-lime">{article.minutes} read</p>
        <h1 className="mt-1 font-display text-[28px] uppercase leading-8">{article.title}</h1>
        <div className="mt-4 space-y-3 text-[15px] leading-[22px] text-[#d1d5db]">
          {article.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </article>
    </Screen>
  );
}
