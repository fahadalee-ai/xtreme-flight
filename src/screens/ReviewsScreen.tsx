import { communityPhotos, socials, stories } from "@/data/content";
import { Button, Header, Screen } from "@/components/chrome";
import { Gallery } from "@/components/Gallery";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";

export function ReviewsScreen() {
  const app = useApp();
  const go = useGo();
  const all = [...app.reviews, ...stories.map((s) => ({ ...s, pending: false }))];
  return (
    <Screen>
      <Header title="Stories" />
      <div className="space-y-3 px-4">
        {all.map((review) => (
          <article key={review.id} className="card p-4">
            <p className="text-lime">{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</p>
            <h2 className="mt-1 font-display text-[18px] uppercase">{review.title}</h2>
            <p className="mt-2 text-[15px] leading-[22px]">“{review.text}”</p>
            <p className="mt-2 text-[12px] text-[#9ca3af]">
              {review.name} · {review.role} · {review.location}
              {review.pending ? " · Submitted for approval" : ""}
            </p>
          </article>
        ))}
        <Button onClick={() => (app.user ? go("/reviews/write") : go("/login"))}>Write a review</Button>
        <article className="card p-4">
          <h2 className="font-display text-[18px] uppercase">Share your flight</h2>
          <p className="mt-1 text-[13px] text-[#9ca3af]">I just flew an XA-42 with @xtreme.flight</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a key={s.id} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-2 text-[12px]">
                {s.label}
              </a>
            ))}
          </div>
        </article>
      </div>
      <h2 className="mb-3 mt-6 px-4 font-display text-[18px] uppercase">From the field</h2>
      <Gallery photos={communityPhotos} />
    </Screen>
  );
}
