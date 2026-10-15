import { Bell, Clapperboard, Gift, LifeBuoy, MapPin, Package, Phone, Plane } from "lucide-react";
import { images } from "@/img/images";
import { HERO, HERO_VIDEO, socials, stories } from "@/data/content";
import { Button, CountUp, LargeTitle, Screen, SectionTitle } from "@/components/chrome";
import { PackageCard } from "@/components/PackageCard";
import { StatusChip } from "@/components/StatusChip";
import { packages } from "@/data/content";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, SLOT_TIME, daysUntil, formatDate, mapsLinks } from "@/lib/format";
import { useAuthGate, useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";
import { useLoad } from "@/services/use-load";
import { api } from "@/services/api";
import { Skeleton } from "@/components/Skeleton";

const actions = [
  { label: "Book Flight", icon: Plane, to: "/book", auth: true },
  { label: "Packages", icon: Package, to: "/flights", auth: false },
  { label: "Gift Certificate", icon: Gift, to: "/gifts", auth: false },
  { label: "My Media", icon: Clapperboard, to: "/media", auth: true },
  { label: "Flight Day Info", icon: MapPin, to: "/flight-day", auth: false },
  { label: "Support", icon: LifeBuoy, to: "/support", auth: false },
];

export function HomeScreen() {
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const gate = useAuthGate();
  const packs = useLoad(() => api.packages(), []);
  const upcoming = mine.bookings.find((b) => ["Confirmed", "Weather Watch", "Pending", "Rescheduled", "Delayed"].includes(b.status));
  const first = app.user?.name.split(" ")[0];
  const open = (to: string, auth: boolean) => {
    if (auth) gate(to);
    else go(to);
  };

  if (!app.hydrated) return <Screen tab><Skeleton className="mx-4 mt-6 h-40" /></Screen>;

  return (
    <Screen tab>
      <LargeTitle
        eyebrow={app.t("ready")}
        title={first || "Guest"}
        right={
          <button type="button" aria-label="Notifications" className="press relative flex h-11 w-11 items-center justify-center" onClick={() => go("/notifications")}>
            <Bell size={22} />
            {mine.unread > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-lime" /> : null}
          </button>
        }
      />

      <section className="relative mx-4 overflow-hidden rounded-[20px]">
        <video className="aspect-[4/5] max-h-[430px] w-full object-cover" autoPlay muted loop playsInline poster={images.xa42Flight}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent" />
        <div className="on-media absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[12px] uppercase tracking-[0.2em] text-lime">Real flight</p>
          <h1 className="font-display text-[32px] uppercase leading-9">{HERO}</h1>
          <Button className="mt-3" onClick={() => gate("/book")}>
            {app.t("bookFlight")}
          </Button>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-2 px-4">
        {actions.map((a) => (
          <button key={a.label} type="button" onClick={() => open(a.to, a.auth)} className="press card flex min-h-[88px] flex-col items-start justify-between p-3 text-left">
            <a.icon size={18} className="text-lime" />
            <span className="text-[12px] leading-4">{a.label}</span>
          </button>
        ))}
      </section>

      {upcoming ? (
        <section className="mt-6">
          <SectionTitle>{app.t("upcoming")}</SectionTitle>
          <article className="card mx-4 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-[20px] uppercase leading-6">{formatDate(upcoming.date)}</p>
                <p className="text-[13px] text-[#9ca3af]">
                  {upcoming.slot} · {SLOT_TIME[upcoming.slot]} · {upcoming.ref}
                </p>
              </div>
              <StatusChip status={upcoming.status} />
            </div>
            <p className="mt-3 font-display text-[28px] leading-8 text-lime">
              {daysUntil(upcoming.date) <= 0 ? "Today" : `${daysUntil(upcoming.date)} days`}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => window.open(mapsLinks().google, "_blank", "noopener,noreferrer")}>
                Directions
              </Button>
              <Button onClick={() => go(`/bookings/${upcoming.id}`)}>Details</Button>
            </div>
          </article>
        </section>
      ) : null}

      <section className="mt-6">
        <div className="grid grid-cols-4 gap-2 px-4">
          {[
            { n: 10, prefix: "±", suffix: "", label: "G" },
            { n: 540, prefix: "", suffix: "°", label: "/sec roll" },
            { n: 720, prefix: "", suffix: "°", label: "/sec snap" },
            { n: 259, prefix: "", suffix: "", label: "mph VNE" },
          ].map((s) => (
            <div key={s.label} className="card px-1 py-3 text-center">
              <p className="font-display text-[20px] leading-6 text-lime">
                {s.prefix}
                <CountUp value={s.n} />
                {s.suffix}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-[#9ca3af]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle action={<button type="button" className="text-[13px] text-lime" onClick={() => go("/flights")}>See all</button>}>
          {app.t("packages")}
        </SectionTitle>
        {packs.status === "loading" ? (
          <Skeleton className="mx-4 h-40" />
        ) : (
          <div className="flex snap-x gap-3 overflow-x-auto px-4 no-scrollbar">
            {(packs.data || packages).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} compact onClick={() => go(`/flights/${pkg.id}`)} />
            ))}
          </div>
        )}
      </section>

      <button type="button" onClick={() => go("/aircraft")} className="press card mx-4 mt-6 block overflow-hidden text-left">
        <img src={images.xa42Bw} alt="The XA-42" className="h-40 w-full object-cover" loading="lazy" />
        <div className="p-4">
          <p className="text-[12px] uppercase tracking-[0.16em] text-lime">The aircraft</p>
          <h2 className="font-display text-[24px] uppercase">The XA-42</h2>
          <p className="mt-1 text-[14px] leading-5 text-[#9ca3af]">The only XA-42 aerobatic experience in the U.S. Fully composite. FAA and EASA certified.</p>
        </div>
      </button>

      <section className="mt-6">
        <SectionTitle action={<button type="button" className="text-[13px] text-lime" onClick={() => go("/reviews")}>All</button>}>
          {app.t("stories")}
        </SectionTitle>
        <div className="flex snap-x gap-3 overflow-x-auto px-4 no-scrollbar">
          {stories.map((s) => (
            <article key={s.id} className="card w-[82%] shrink-0 snap-center p-4">
              <p className="text-lime">{"★".repeat(s.stars)}</p>
              <p className="mt-2 text-[15px] leading-[22px]">“{s.text}”</p>
              <p className="mt-3 text-[12px] text-[#9ca3af]">
                {s.name} · {s.role} · {s.location}
              </p>
            </article>
          ))}
        </div>
      </section>

      <button type="button" onClick={() => go("/kids")} className="press card mx-4 mt-6 block overflow-hidden text-left">
        <img src={images.kidInverted} alt="Young passenger inverted in the XA-42" className="h-44 w-full object-cover" loading="lazy" />
        <div className="p-4">
          <h2 className="font-display text-[24px] uppercase leading-7">A first flight they'll never forget</h2>
          <p className="mt-1 text-[14px] leading-5 text-[#9ca3af]">Ages 7 and up. Custom-fitted gear. They set the pace.</p>
        </div>
      </button>

      <button type="button" onClick={() => go("/events")} className="press mx-4 mt-4 block w-[calc(100%-2rem)] rounded-[18px] bg-lime px-4 py-4 text-left text-ink">
        <p className="font-display text-[22px] uppercase leading-6">Group and event flights</p>
        <p className="mt-1 text-[14px] leading-5">Birthdays, teams, and airshow-style days. We'll reply with pricing.</p>
      </button>

      <footer className="mt-6 space-y-3 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <a className="btn btn-outline" href={`tel:${PHONE_TEL}`}>
            <Phone size={16} /> Call
          </a>
          <a className="btn btn-outline" href={`mailto:${EMAIL}`}>
            Email
          </a>
        </div>
        <p className="text-center text-[12px] text-[#9ca3af]">{PHONE_DISPLAY}</p>
        <div className="flex justify-center gap-3">
          {socials.map((s) => (
            <a key={s.id} href={s.href} target="_blank" rel="noreferrer" className="text-[12px] text-lime">
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </Screen>
  );
}
