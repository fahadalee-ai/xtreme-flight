import { Header, Screen } from "@/components/chrome";
import { RISK_COPY } from "@/lib/format";
import { useGo } from "@/lib/nav";

const items = [
  { title: "Part 61 instruction", body: "Flights are conducted by certified instructors under 14 CFR Part 61." },
  { title: "FAA maintenance", body: "The aircraft is maintained in accordance with FAA regulations." },
  { title: "Certified airframe", body: "The XA-42 is FAA and EASA certified for unlimited aerobatics." },
  { title: "You stop, we stop", body: "We start gentle and build only as far as you want. Say the word and the maneuver stops." },
  { title: "Headset the whole flight", body: "You can talk with your instructor from briefing through landing." },
  { title: "About 90 seconds to land", body: "If you feel unwell, your instructor can have the aircraft on the ground in about a minute and a half." },
];

export function SafetyScreen() {
  const go = useGo();
  return (
    <Screen>
      <Header title="Safety" />
      <div className="space-y-3 px-4">
        {items.map((item) => (
          <article key={item.title} className="card p-4">
            <h2 className="font-display text-[18px] uppercase">{item.title}</h2>
            <p className="mt-1 text-[14px] leading-5 text-[#d1d5db]">{item.body}</p>
          </article>
        ))}
        <article className="rounded-[18px] border border-danger/40 bg-danger/10 p-4">
          <h2 className="font-display text-[18px] uppercase">Risk acknowledgment</h2>
          <p className="mt-2 text-[14px] leading-5">{RISK_COPY}</p>
        </article>
        <button type="button" className="text-[14px] text-lime" onClick={() => go("/prep")}>
          What to wear, wellness, and cameras
        </button>
      </div>
    </Screen>
  );
}
