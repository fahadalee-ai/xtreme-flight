import { SLOT_TIME, type Slot } from "@/lib/format";

const slots: Slot[] = ["Morning", "Midday", "Afternoon"];

export function TimeSlotChips({ value, onChange }: { value: Slot | ""; onChange: (slot: Slot) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => {
          const active = value === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onChange(slot)}
              className={`press min-h-11 rounded-full px-4 text-[14px] font-semibold ${active ? "bg-lime text-ink" : "border border-line bg-surface text-white"}`}
            >
              {slot} · {SLOT_TIME[slot]}
            </button>
          );
        })}
      </div>
      <p className="text-[12px] leading-4 text-[#9ca3af]">
        Plan on approximately 4 hours with us. Weather and mechanical factors may cause delays.
      </p>
    </div>
  );
}
