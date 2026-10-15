import { useState } from "react";
import { images } from "@/img/images";
import { packageById } from "@/data/content";
import { Button, LargeTitle, Screen, Segmented } from "@/components/chrome";
import { EmptyState } from "@/components/EmptyState";
import { StatusChip } from "@/components/StatusChip";
import { SLOT_TIME, formatDate } from "@/lib/format";
import { useAuthGate, useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";
import type { BookingStatus } from "@/data/types";

const groups: { id: string; label: string; statuses: BookingStatus[] }[] = [
  { id: "upcoming", label: "Upcoming", statuses: ["Confirmed", "Pending", "Weather Watch", "Delayed", "Rescheduling Needed", "Rescheduled"] },
  { id: "completed", label: "Completed", statuses: ["Completed"] },
  { id: "cancelled", label: "Cancelled", statuses: ["Cancelled", "Cancelled by Operator"] },
];

export function BookingsScreen() {
  const [tab, setTab] = useState("upcoming");
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const gate = useAuthGate();
  const group = groups.find((g) => g.id === tab) || groups[0];
  const list = mine.bookings.filter((b) => group.statuses.includes(b.status));

  return (
    <Screen tab>
      <LargeTitle title="My bookings" />
      <div className="px-4">
        <Segmented value={tab} onChange={setTab} options={groups.map((g) => ({ id: g.id, label: g.label }))} />
      </div>
      {!app.user ? (
        <div className="px-4 pt-6">
          <EmptyState
            image={images.emptyFlights}
            title="Sign in to see flights"
            body="Your upcoming, completed, and cancelled flights live with your account."
            action={<Button onClick={() => go("/login")}>Log In</Button>}
          />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          image={images.emptyFlights}
          title={tab === "upcoming" ? "No upcoming flights" : `No ${tab} flights`}
          body="The ramp is quiet. Pick a package and a date when you're ready."
          action={
            <Button
              onClick={() => {
                gate("/book");
              }}
            >
              Book Now
            </Button>
          }
        />
      ) : (
        <div className="mt-4 space-y-3 px-4">
          {list.map((b) => {
            const pkg = packageById(b.packageId);
            return (
              <button key={b.id} type="button" onClick={() => go(`/bookings/${b.id}`)} className="press card w-full p-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-[18px] uppercase">{pkg?.name}</p>
                    <p className="text-[13px] text-[#9ca3af]">
                      {formatDate(b.date)} · {SLOT_TIME[b.slot]}
                    </p>
                    <p className="mt-1 text-[12px] tracking-wide text-lime">{b.ref}</p>
                  </div>
                  <StatusChip status={b.status} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
