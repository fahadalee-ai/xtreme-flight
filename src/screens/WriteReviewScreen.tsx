import { useState } from "react";
import { Button, CheckField, GuestWall, Header, Screen, TextArea, TextField } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";

export function WriteReviewScreen() {
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const completed = mine.bookings.filter((b) => b.status === "Completed");
  const [bookingId, setBookingId] = useState(completed[0]?.id || "");
  const [stars, setStars] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) return <GuestWall title="Write a review" body="Reviews are open after a completed flight." />;
  if (completed.length === 0) {
    return (
      <Screen>
        <Header title="Write a review" />
        <p className="px-4 text-[14px] leading-5 text-[#9ca3af]">Reviews open after you complete a flight.</p>
      </Screen>
    );
  }
  if (sent) {
    return (
      <Screen>
        <Header title="Review" back="/reviews" />
        <div className="px-4 text-center">
          <div className="check-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-3xl text-ink">✓</div>
          <h2 className="mt-4 font-display text-[24px] uppercase">Submitted for approval</h2>
          <p className="mt-2 text-[14px] text-[#9ca3af]">Thanks. If you opted in, we may feature it once it's reviewed.</p>
          <Button className="mt-4" onClick={() => go("/reviews")}>Back to stories</Button>
        </div>
      </Screen>
    );
  }

  const valid = Boolean(bookingId) && stars > 0 && title.trim().length > 2 && text.trim().length > 8 && consent;

  return (
    <Screen>
      <Header title="Write a review" />
      <form
        className="ios-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          app.rateBooking(bookingId, stars, title.trim(), text.trim());
          setSent(true);
        }}
      >
        <label className="ios-field">
          <span className="ios-field-label">Flight</span>
          <select className="field" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
            {completed.map((b) => (
              <option key={b.id} value={b.id}>
                {b.ref}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" aria-label={`${n} stars`} className={`h-11 w-11 text-2xl ${n <= stars ? "text-lime" : "text-white/30"}`} onClick={() => setStars(n)}>
              ★
            </button>
          ))}
        </div>
        <TextField label="Title" value={title} onChange={setTitle} />
        <TextArea label="Your flight" value={text} onChange={setText} />
        <label className="block text-[12px] text-[#9ca3af]">
          Photos or video
          <input className="mt-1 block w-full text-[14px] text-white" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0]?.name || "")} />
          {file ? <span className="mt-1 block text-lime">{file} · submitted for approval</span> : null}
        </label>
        <CheckField checked={consent} onChange={setConsent}>
          Xtreme Flight may feature this review publicly.
        </CheckField>
        <Button type="submit" disabled={!valid}>
          Submit review
        </Button>
      </form>
    </Screen>
  );
}
