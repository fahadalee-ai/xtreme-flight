import { useState } from "react";
import { FAQ_CATEGORIES, faqs } from "@/data/content";
import { Header, Screen } from "@/components/chrome";
import { ErrorBlock } from "@/components/chrome";
import { SkeletonList } from "@/components/Skeleton";
import { api } from "@/services/api";
import { useLoad } from "@/services/use-load";

export function FaqScreen() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const query = useLoad(() => api.faqs(), []);
  const source = query.data || [];
  const list = source.filter((f) => (cat === "All" || f.category === cat) && (f.q + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <Screen>
      <Header title="FAQ" />
      <div className="ios-stack">
        <input className="field" aria-label="Search questions" placeholder="Search questions" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FAQ_CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={`press shrink-0 rounded-full px-3 py-2 text-[12px] ${cat === c ? "bg-lime text-ink" : "border border-line"}`}>
              {c}
            </button>
          ))}
        </div>
        {query.status === "loading" ? <div className="mt-4"><SkeletonList /></div> : null}
        {query.status === "error" ? <div className="mt-4"><ErrorBlock message={query.error} onRetry={query.retry} /></div> : null}
        <div className="mt-4 space-y-2">
          {list.map((f) => (
            <button key={f.id} type="button" className="card w-full p-3 text-left" aria-expanded={open === f.id} onClick={() => setOpen(open === f.id ? null : f.id)}>
              <span className="block text-[14px] font-semibold">{f.q}</span>
              <span className="mt-1 block text-[11px] uppercase tracking-wide text-lime">{f.category}</span>
              {open === f.id ? <span className="mt-2 block text-[14px] leading-5 text-[#d1d5db]">{f.a}</span> : null}
            </button>
          ))}
          {query.status === "ready" && list.length === 0 ? <p className="text-[14px] text-[#9ca3af]">No matches. Try another word or call 601-XFLIGHT.</p> : null}
        </div>
      </div>
    </Screen>
  );
}
