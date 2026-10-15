import { useState } from "react";
import { Check } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { faqs, galleryFor, inclusionsFor, packageById } from "@/data/content";
import { Button, Header, PolicyNote, Screen, StickyBar } from "@/components/chrome";
import { ErrorBlock } from "@/components/chrome";
import { VideoPlayer } from "@/components/VideoPlayer";
import { HERO_VIDEO } from "@/data/content";
import { images } from "@/img/images";
import { CANCEL_POLICY, PRICE_PROMISE, WEATHER_POLICY, money } from "@/lib/format";
import { useAuthGate, useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";
import { useLoad } from "@/services/use-load";
import { api } from "@/services/api";
import { SkeletonPage } from "@/components/Skeleton";

export function PackageDetailScreen() {
  const { packageId } = useParams({ from: "/flights/$packageId" });
  const q = useLoad(() => api.package(packageId), [packageId]);
  const pkg = q.data || packageById(packageId);
  const go = useGo();
  const gate = useAuthGate();
  const app = useApp();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const related = faqs.filter((f) => ["limits", "physical", "cancel", "video", "safe"].includes(f.id));

  if (q.status === "loading" && !pkg) return <SkeletonPage />;
  if (!pkg) return <Screen><Header title="Package" /><ErrorBlock message="That package is not on the list." onRetry={() => go("/flights")} /></Screen>;

  const shots = galleryFor[pkg.id] || [];

  return (
    <Screen className="pb-28">
      <Header title={pkg.name} />
      <div className="flex snap-x gap-2 overflow-x-auto px-4 no-scrollbar">
        {shots.map((shot) => (
          <img key={shot.src} src={shot.src} alt={shot.alt} className="h-52 w-[86%] shrink-0 snap-center rounded-[18px] object-cover" />
        ))}
      </div>
      <div className="mt-4 px-4">
        <VideoPlayer src={HERO_VIDEO} poster={images.xa42Flight} />
      </div>
      <div className="mt-4 flex items-end justify-between px-4">
        <div>
          <p className="text-[13px] text-[#9ca3af]">{pkg.minutes}</p>
          <h2 className="font-display text-[28px] uppercase leading-8">{pkg.name}</h2>
        </div>
        <p className="font-display text-[28px] text-lime">{money(pkg.price)}</p>
      </div>
      <p className="mt-2 px-4 text-[15px] leading-[22px] text-[#d1d5db]">{pkg.blurb}</p>
      <div className="mt-4 px-4">
        <PolicyNote>{PRICE_PROMISE}</PolicyNote>
      </div>
      <section className="mt-5 px-4">
        <h3 className="font-display text-[18px] uppercase">Included</h3>
        <ul className="mt-2 space-y-2">
          {inclusionsFor(pkg.id).map((item) => (
            <li key={item} className="flex gap-2 text-[14px] leading-5">
              <Check size={16} className="mt-0.5 shrink-0 text-lime" />
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-5 px-4 text-[14px] leading-5 text-[#d1d5db]">
        <h3 className="font-display text-[18px] uppercase text-white">Requirements</h3>
        <p className="mt-2">Maximum weight 250 lbs. Maximum height 6'1". Maximum trunk circumference 44". Ages 7 and up. Under 5 feet requires the parachute add-on. Not available if pregnant.</p>
        <h3 className="mt-4 font-display text-[18px] uppercase text-white">Safety</h3>
        <p className="mt-2">Certified instructor, headset the entire flight, and you stop when you say stop. The instructor can land in about 90 seconds if you feel unwell.</p>
        <h3 className="mt-4 font-display text-[18px] uppercase text-white">Cancellation</h3>
        <p className="mt-2">{CANCEL_POLICY}</p>
        <p className="mt-2">{WEATHER_POLICY}</p>
      </section>
      <section className="mt-5 px-4">
        <h3 className="font-display text-[18px] uppercase">FAQ</h3>
        <div className="mt-2 space-y-2">
          {related.map((f) => (
            <button key={f.id} type="button" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)} className="card w-full p-3 text-left" aria-expanded={openFaq === f.id}>
              <span className="block text-[14px] font-semibold">{f.q}</span>
              {openFaq === f.id ? <span className="mt-2 block text-[13px] leading-5 text-[#9ca3af]">{f.a}</span> : null}
            </button>
          ))}
        </div>
        <button type="button" className="mt-3 text-[13px] text-lime" onClick={() => go("/faq")}>
          All questions
        </button>
      </section>
      <StickyBar>
        <div className="flex items-center gap-3">
          <div className="min-w-[88px]">
            <p className="text-[12px] text-[#9ca3af]">From</p>
            <p className="font-display text-[22px] leading-6 text-lime">{money(pkg.price)}</p>
          </div>
          <Button
            onClick={() => {
              app.setPreselect(pkg.id);
              gate("/book");
            }}
          >
            Book Now
          </Button>
        </div>
      </StickyBar>
    </Screen>
  );
}
