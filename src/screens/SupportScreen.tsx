import { useState } from "react";
import { Header, Screen } from "@/components/chrome";
import { faqs } from "@/data/content";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/format";
import { useGo } from "@/lib/nav";

export function SupportScreen() {
  const [q, setQ] = useState("");
  const go = useGo();
  const hits = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())).slice(0, 4);
  return (
    <Screen>
      <Header title="Support" />
      <div className="ios-stack">
        <input className="field" placeholder="Search help" aria-label="Search help" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <a className="btn btn-primary" href={`tel:${PHONE_TEL}`}>Call {PHONE_DISPLAY.split(" ")[0]}</a>
          <a className="btn btn-outline" href={`mailto:${EMAIL}`}>Email</a>
          <button type="button" className="btn btn-outline" onClick={() => go("/contact")}>Contact form</button>
          <button type="button" className="btn btn-outline" onClick={() => go("/bookings")}>Booking inquiry</button>
        </div>
        <h2 className="pt-2 font-display text-[18px] uppercase">Popular questions</h2>
        {(q ? hits : faqs.slice(0, 4)).map((f) => (
          <button key={f.id} type="button" onClick={() => go("/faq")} className="card w-full p-3 text-left text-[14px]">
            {f.q}
          </button>
        ))}
        <button type="button" className="text-[13px] text-lime" onClick={() => go("/faq")}>
          Browse all FAQ
        </button>
        <div className="grid gap-2">
          <button type="button" className="card p-3 text-left" onClick={() => go("/articles/safety-prep")}>
            Safety and flight preparation
          </button>
          <button type="button" className="card p-3 text-left" onClick={() => go("/articles/payments")}>
            Payments and cancellations
          </button>
        </div>
      </div>
    </Screen>
  );
}
