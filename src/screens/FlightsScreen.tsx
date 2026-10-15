import { useState } from "react";
import { PARACHUTE, intensities, packages } from "@/data/content";
import { Button, LargeTitle, PolicyNote, Screen, Segmented } from "@/components/chrome";
import { PackageCard } from "@/components/PackageCard";
import { ErrorBlock } from "@/components/chrome";
import { SkeletonList } from "@/components/Skeleton";
import { PRICE_PROMISE, money } from "@/lib/format";
import { useAuthGate, useGo } from "@/lib/nav";
import { api } from "@/services/api";
import { useLoad } from "@/services/use-load";
import { tokens } from "@/theme/tokens";

function Gauge({ g }: { g: number }) {
  const pct = g / 10;
  const angle = Math.PI * (1 - pct);
  const x = 50 + Math.cos(angle) * 36;
  const y = 52 - Math.sin(angle) * 36;
  return (
    <svg viewBox="0 0 100 60" className="h-16 w-full" aria-hidden>
      <path d="M14 52 A36 36 0 0 1 86 52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
      <path d="M14 52 A36 36 0 0 1 86 52" fill="none" stroke={tokens.lime} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${pct * 113} 113`} />
      <circle cx={x} cy={y} r="4" fill={tokens.lime} />
      <text x="50" y="50" textAnchor="middle" fill="white" fontSize="12" fontFamily="Barlow Condensed, sans-serif">
        {g} G
      </text>
    </svg>
  );
}

export function FlightsScreen() {
  const [tab, setTab] = useState("packages");
  const [level, setLevel] = useState(2);
  const go = useGo();
  const gate = useAuthGate();
  const q = useLoad(() => api.packages(), []);
  const names = ["Mild", "Adventurous", "Xtreme"];

  return (
    <Screen tab>
      <LargeTitle eyebrow="Experiences" title="Choose your flight" />
      <div className="px-4">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: "packages", label: "Packages" },
            { id: "experiences", label: "Experiences" },
            { id: "compare", label: "Compare" },
          ]}
        />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {[
          ["/aircraft", "The XA-42"],
          ["/kids", "Kids"],
          ["/crew", "The Crew"],
          ["/eligibility", "Eligibility"],
          ["/safety", "Safety"],
        ].map(([to, label]) => (
          <button key={to} type="button" onClick={() => go(to)} className="press shrink-0 rounded-full border border-line px-3 py-2 text-[12px] text-[#d1d5db]">
            {label}
          </button>
        ))}
      </div>

      {tab === "packages" && (
        <div className="mt-4 space-y-3 px-4">
          <PolicyNote>{PRICE_PROMISE}</PolicyNote>
          {q.status === "loading" ? <SkeletonList /> : null}
          {q.status === "error" ? <ErrorBlock message={q.error} onRetry={q.retry} /> : null}
          {q.data?.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onClick={() => go(`/flights/${pkg.id}`)} />
          ))}
          <article className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[18px] uppercase">{PARACHUTE.name}</h3>
                <p className="mt-1 text-[14px] leading-5 text-[#9ca3af]">{PARACHUTE.blurb}</p>
              </div>
              <span className="font-display text-[20px] text-lime">+{money(PARACHUTE.price)}</span>
            </div>
            <p className="mt-3 text-[12px] leading-4 text-[#9ca3af]">Added at booking when a passenger is under 5 feet tall.</p>
          </article>
        </div>
      )}

      {tab === "experiences" && (
        <div className="mt-4 space-y-3 px-4">
          <h2 className="font-display text-[24px] uppercase leading-7">Mild to Xtreme — you choose the throttle.</h2>
          {intensities.map((levelItem) => (
            <article key={levelItem.id} className="card p-4">
              <Gauge g={levelItem.g} />
              <h3 className="font-display text-[20px] uppercase">{levelItem.name}</h3>
              <p className="text-[13px] text-lime">{levelItem.summary}</p>
              <p className="mt-2 text-[14px] leading-5 text-[#d1d5db]">{levelItem.detail}</p>
              <p className="mt-3 text-[12px] leading-4 text-[#9ca3af]">We always start gentle and build up. You decide.</p>
            </article>
          ))}
        </div>
      )}

      {tab === "compare" && (
        <div className="mt-4 px-4">
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead className="text-[#9ca3af]">
                <tr>
                  <th className="p-3 font-medium"> </th>
                  {packages.map((p) => (
                    <th key={p.id} className="p-3 font-display text-[14px] uppercase text-white">
                      {p.name.replace("Xtreme Flight", "Flight")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Duration", ...packages.map((p) => p.minutes)],
                  ["Price", ...packages.map((p) => money(p.price))],
                  ["Video", ...packages.map((p) => (p.video ? "Included" : "Add later"))],
                  ["You fly", ...packages.map((p) => (p.pilotControl ? "Yes" : "Instructor"))],
                  ["Best for", ...packages.map((p) => p.bestFor)],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-line">
                    {row.map((cell, i) => (
                      <td key={i} className={`p-3 ${i === 0 ? "text-[#9ca3af]" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card mt-3 p-4">
            <p className="text-[12px] uppercase tracking-wide text-[#9ca3af]">Intensity guide</p>
            <input
              aria-label="Intensity"
              type="range"
              min={0}
              max={2}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="mt-3 w-full accent-[#a3e635]"
            />
            <p className="mt-2 font-display text-[22px] uppercase text-lime">{names[level]}</p>
            <p className="text-[13px] leading-5 text-[#9ca3af]">{intensities[level]?.detail}</p>
          </div>
          <Button className="mt-4" onClick={() => gate("/book")}>
            Book Now
          </Button>
        </div>
      )}
    </Screen>
  );
}
