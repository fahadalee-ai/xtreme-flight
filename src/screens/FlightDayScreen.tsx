import { useState } from "react";
import { flightDaySteps, checklistItems } from "@/data/content";
import { Button, Header, Screen } from "@/components/chrome";
import { EMAIL, PHONE_TEL, SLOT_TIME, daysUntil, formatDate } from "@/lib/format";
import { useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";

export function FlightDayScreen() {
  const [open, setOpen] = useState(0);
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const upcoming = mine.bookings.find((b) => ["Confirmed", "Weather Watch", "Rescheduled", "Delayed", "Pending"].includes(b.status));
  const done = checklistItems.filter((item) => app.checklist[item.id]).length;
  const pct = Math.round((done / checklistItems.length) * 100);
  const ref = upcoming?.ref || "my flight";

  return (
    <Screen>
      <Header title="Flight Day" />
      <div className="px-4">
        {upcoming ? (
          <article className="card overflow-hidden">
            <div className="bg-lime/15 p-4">
              <p className="text-[12px] uppercase tracking-wide text-lime">Countdown</p>
              <p className="font-display text-[36px] leading-9 text-lime">{daysUntil(upcoming.date) <= 0 ? "Today" : `${daysUntil(upcoming.date)} days`}</p>
              <p className="mt-1 text-[14px]">
                {formatDate(upcoming.date)} · {SLOT_TIME[upcoming.slot]}
              </p>
            </div>
          </article>
        ) : (
          <p className="text-[14px] leading-5 text-[#9ca3af]">No date on the books yet. The day still follows the same five steps.</p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => go("/location")}>
            Directions
          </Button>
          <Button variant="outline" onClick={() => upcoming && go(`/weather/${upcoming.id}`)}>
            Weather
          </Button>
        </div>
        <h2 className="mt-6 font-display text-[24px] uppercase">Five steps</h2>
        <ol className="mt-3 space-y-3">
          {flightDaySteps.map((step, i) => (
            <li key={step.n}>
              <button type="button" onClick={() => setOpen(i)} className="card w-full overflow-hidden text-left" aria-expanded={open === i}>
                <img src={step.image} alt="" className="h-32 w-full object-cover" loading="lazy" />
                <div className="p-3">
                  <p className="text-[12px] text-lime">Step {step.n}</p>
                  <p className="font-display text-[18px] uppercase">{step.title}</p>
                  {open === i ? <p className="mt-2 text-[14px] leading-5 text-[#d1d5db]">{step.body}</p> : null}
                </div>
              </button>
            </li>
          ))}
        </ol>
        <section className="card mt-5 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[18px] uppercase">Pre-flight checklist</h2>
            <svg viewBox="0 0 36 36" className="h-12 w-12" aria-hidden>
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#a3e635" strokeWidth="3" strokeDasharray={`${pct} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
            </svg>
          </div>
          <p className="text-[12px] text-[#9ca3af]">{done} of {checklistItems.length}</p>
          <ul className="mt-3 space-y-2">
            {checklistItems.map((item) => (
              <li key={item.id}>
                <label className="ios-check-row">
                  <input type="checkbox" checked={Boolean(app.checklist[item.id])} onChange={() => app.toggleCheck(item.id)} />
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-4 text-[14px] leading-5 text-[#d1d5db]">
          <h2 className="font-display text-[18px] uppercase text-white">Plan your day</h2>
          <p className="mt-2">Total time on site is about 4 hours. Wear comfortable clothes and flat shoes, hair tied back. Remove jewelry, watches, pocket items, and phones. Bring a government ID.</p>
          <button type="button" className="mt-3 text-lime" onClick={() => go("/eligibility")}>
            Eligibility reminder
          </button>
          <p className="mt-3">Safety briefing: you stop, we stop. Headset stays on. If you feel unwell, landing is about 90 seconds away.</p>
        </section>
        <div className="mt-4 grid grid-cols-1 gap-2">
          <a className="btn btn-outline" href={`tel:${PHONE_TEL}`}>Call 601-XFLIGHT</a>
          <a className="btn btn-outline" href={`mailto:${EMAIL}`}>Email</a>
          <a className="btn btn-ghost" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Running late " + ref)}&body=${encodeURIComponent("Hi Xtreme Flight, I'm running late for " + ref + ".")}`}>
            I'm running late
          </a>
        </div>
      </div>
    </Screen>
  );
}
