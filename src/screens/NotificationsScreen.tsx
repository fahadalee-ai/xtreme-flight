import { useState } from "react";
import { Header, Screen } from "@/components/chrome";
import { useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";
import type { NoteCategory } from "@/data/types";

const filters = ["All", "Bookings", "Reminders", "Weather", "Payments", "Media"] as const;

function when(at: number) {
  const diff = Date.now() - at;
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function NotificationsScreen() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const notes = mine.notes.filter((n) => filter === "All" || n.category === filter);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = notes.filter((n) => n.at >= start.getTime());
  const earlier = notes.filter((n) => n.at < start.getTime());

  const open = (category: NoteCategory, id: string) => {
    app.markRead(id);
    if (category === "Media") go("/media");
    else if (category === "Weather") {
      const booking = mine.bookings.find((b) => b.status === "Weather Watch") || mine.bookings[0];
      if (booking) go(`/weather/${booking.id}`);
    } else if (category === "Payments") go("/profile/payments");
    else go("/bookings");
  };

  return (
    <Screen>
      <Header
        title="Notifications"
        right={
          <button type="button" className="text-[13px] text-lime" onClick={() => app.markAllRead()}>
            Read all
          </button>
        }
      />
      <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {filters.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`press shrink-0 rounded-full px-3 py-2 text-[12px] ${filter === f ? "bg-lime text-ink" : "border border-line text-[#d1d5db]"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="mt-4 px-4">
        {notes.length === 0 ? <p className="text-[14px] text-[#9ca3af]">No alerts in this filter.</p> : null}
        {(
          [
            { label: "Today", list: today },
            { label: "Earlier", list: earlier },
          ] as const
        ).map(({ label, list }) =>
          list.length ? (
            <section key={label} className="mb-4">
              <h2 className="mb-2 text-[12px] uppercase tracking-wide text-[#9ca3af]">{label}</h2>
              <div className="space-y-2">
                {list.map((n) => (
                  <button key={n.id} type="button" onClick={() => open(n.category, n.id)} className="press card w-full p-3 text-left">
                    <span className="flex items-center gap-2">
                      {!n.read ? <span className="h-2 w-2 rounded-full bg-lime" /> : null}
                      <span className="text-[14px] font-semibold">{n.title}</span>
                    </span>
                    <span className="mt-1 block text-[13px] leading-5 text-[#9ca3af]">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-[#6b7280]">{when(n.at)} · {n.category}</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null,
        )}
        <button type="button" className="text-[13px] text-lime" onClick={() => go("/settings/notifications")}>
          Notification settings
        </button>
      </div>
    </Screen>
  );
}
