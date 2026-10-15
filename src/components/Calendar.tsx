import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isAvailable(date: Date) {
  const today = startOfDay(new Date());
  const t = startOfDay(date);
  const diff = Math.round((t.getTime() - today.getTime()) / 86400000);
  if (diff < 7 || diff > 42) return false;
  if (![2, 4, 6].includes(t.getDay())) return false;
  if (t.getDate() === 13) return false;
  return true;
}

export function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function Calendar({ value, onChange, anyDay = false }: { value: string; onChange: (iso: string) => void; anyDay?: boolean }) {
  const initial = value ? new Date(value + "T12:00:00") : new Date();
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));

  return (
    <div className="card p-3">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className="press flex h-11 w-11 items-center justify-center" onClick={() => setCursor(new Date(year, month - 1, 1))}>
          <ChevronLeft size={18} />
        </button>
        <p className="font-display text-[18px] uppercase">{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <button type="button" aria-label="Next month" className="press flex h-11 w-11 items-center justify-center" onClick={() => setCursor(new Date(year, month + 1, 1))}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#9ca3af]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}${i}`}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />;
          const iso = toIso(date);
          const open = anyDay || isAvailable(date);
          const active = iso === value;
          return (
            <button
              key={iso}
              type="button"
              disabled={!open}
              onClick={() => onChange(iso)}
              className={`h-11 rounded-xl text-[14px] ${active ? "bg-lime font-semibold text-ink" : open ? "bg-lime/15 text-lime" : "text-white/25"}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] leading-4 text-[#9ca3af]">{anyDay ? "Pick any date." : "Dates are posted 1–6 weeks in advance. Lime dates are open."}</p>
    </div>
  );
}
