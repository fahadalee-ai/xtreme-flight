import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Check, LifeBuoy, MapPin, Phone, Receipt, UserRound } from "lucide-react";
import { packageById } from "@/data/content";
import { Button, Header, PolicyNote, Screen } from "@/components/chrome";
import { BottomSheet } from "@/components/BottomSheet";
import { Calendar } from "@/components/Calendar";
import { QrCode } from "@/components/QrCode";
import { StatusChip } from "@/components/StatusChip";
import { TimeSlotChips } from "@/components/TimeSlotChips";
import { checklistItems } from "@/data/content";
import { SkeletonPage } from "@/components/Skeleton";
import { ADDRESS_SHORT, CANCEL_POLICY, EMAIL, PHONE_TEL, SLOT_TIME, formatShort, mapsLinks, money, within48, type Slot } from "@/lib/format";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";
import { cancelReasons } from "@/data/content";

export function BookingDetailScreen() {
  const { bookingId } = useParams({ from: "/bookings/$bookingId" });
  const app = useApp();
  const go = useGo();
  const booking = app.bookings.find((b) => b.id === bookingId);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [date, setDate] = useState(booking?.date || "");
  const [slot, setSlot] = useState<Slot | "">(booking?.slot || "");
  const [reason, setReason] = useState(cancelReasons[0]);

  useEffect(() => {
    if (app.intent?.bookingId === bookingId && app.intent.type === "reschedule") {
      setRescheduleOpen(true);
      app.setIntent(null);
    }
  }, [app, bookingId]);

  if (!app.hydrated) return <SkeletonPage />;
  if (!booking || booking.userId !== app.user?.id) {
    return (
      <Screen>
        <Header title="Booking" />
        <p className="px-4 text-[#9ca3af]">That booking isn't on this device.</p>
      </Screen>
    );
  }

  const pkg = packageById(booking.packageId);
  const late = within48(booking.date, booking.slot);
  const upcoming = !["Completed", "Cancelled", "Cancelled by Operator"].includes(booking.status);
  const [year, month, day] = booking.date.split("-").map(Number);
  const when = new Date(year, (month || 1) - 1, day || 1);
  const weekday = when.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <Screen>
      <Header title="Boarding pass" />
      <div className="px-4 pb-6">
        <article className="relative rounded-[20px] bg-[#1f2937]">
          <div className="h-1.5 rounded-t-[20px] bg-lime" />
          <div className="flex items-center justify-between gap-3 px-4 pt-4">
            <p className="text-[12px] font-semibold tracking-[0.16em] text-lime">WINGS FIELD · 2TN2</p>
            <StatusChip status={booking.status} />
          </div>
          <h2 className="px-4 pt-2 text-[26px] font-bold leading-8 tracking-tight text-white">{pkg?.name ?? "Xtreme Flight"}</h2>
          <p className="px-4 pt-1 text-[15px] leading-5 text-[#d1d5db]">
            {pkg?.minutes}
            {booking.parachute ? " · Parachute add-on" : ""}
          </p>

          <div className="mx-4 mt-4 grid grid-cols-3 gap-2 border-t border-white/10 py-4">
            {[
              ["Date", `${weekday}, ${formatShort(booking.date)}`],
              ["Departs", SLOT_TIME[booking.slot]],
              ["Slot", booking.slot],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{label}</p>
                <p className="mt-1 text-[15px] font-semibold leading-5 text-white">{value}</p>
              </div>
            ))}
          </div>
          <p className="px-4 pb-4 text-[13px] leading-[18px] text-[#d1d5db]">{ADDRESS_SHORT}</p>

          <div className="relative">
            <span className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
            <div className="mx-6 border-t border-dashed border-white/25" />
            <span className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
          </div>

          <div className="px-4 py-5 text-center">
            <QrCode value={booking.ref} />
            <p className="mt-3 text-[20px] font-bold tracking-[0.12em] text-lime">{booking.ref}</p>
            <p className="mt-1 text-[13px] leading-[18px] text-[#d1d5db]">Show this code at check-in</p>
            <p className="mt-3 text-[15px] font-semibold text-white">
              {money(booking.total)}
              <span className="font-normal text-[#d1d5db]"> · {booking.paidWith}</span>
            </p>
            {booking.promo ? <p className="mt-1 text-[13px] text-[#d1d5db]">Certificate {booking.promo}</p> : null}
          </div>
        </article>

        <section className="mt-5">
          <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-[#9ca3af]">Passengers</h2>
          <div className="overflow-hidden rounded-[16px] bg-[#1f2937]">
            {booking.passengers.map((p) => (
              <div key={p.id} className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#273244] text-lime">
                  <UserRound size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[17px] font-semibold leading-[22px] text-white">{p.name}</span>
                  <span className="block text-[13px] leading-[18px] text-[#d1d5db]">
                    Age {p.age}
                    {p.isMinor ? ` · Guardian ${p.guardianName}` : ""}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#9ca3af]">Before you fly</h2>
            <button type="button" className="text-[13px] font-semibold text-lime" onClick={() => go("/flight-day")}>
              Full guide
            </button>
          </div>
          <ul className="overflow-hidden rounded-[16px] bg-[#1f2937]">
            {checklistItems.slice(0, 4).map((item) => (
              <li key={item.id} className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span className="text-[15px] leading-5 text-white">{item.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {[
            { label: "Directions", icon: <MapPin size={20} />, onClick: () => window.open(mapsLinks().google, "_blank", "noopener,noreferrer") },
            { label: "Support", icon: <LifeBuoy size={20} />, onClick: () => go("/support") },
            { label: "Receipt", icon: <Receipt size={20} />, onClick: () => go("/profile/payments") },
          ].map((action) => (
            <button key={action.label} type="button" onClick={action.onClick} className="press flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[14px] bg-[#1f2937] text-lime">
              {action.icon}
              <span className="text-[11px] font-semibold text-[#d1d5db]">{action.label}</span>
            </button>
          ))}
          <a href={`tel:${PHONE_TEL}`} className="press flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[14px] bg-[#1f2937] text-lime">
            <Phone size={20} />
            <span className="text-[11px] font-semibold text-[#d1d5db]">Call</span>
          </a>
        </div>
        {booking.status === "Completed" ? (
          <div className="mt-4 space-y-2">
            <p className="card px-3 py-3 text-[14px]">FAA-legal logbook entry is part of your flight.</p>
            <Button onClick={() => go("/media")}>Watch your video</Button>
            <Button variant="outline" onClick={() => go("/reviews/write")}>
              {booking.rating ? `Rated ${booking.rating} stars` : "Rate your flight"}
            </Button>
          </div>
        ) : null}
        {upcoming ? (
          <div className="mt-4 space-y-2">
            <PolicyNote>{CANCEL_POLICY}</PolicyNote>
            <Button variant="outline" onClick={() => setRescheduleOpen(true)}>
              Reschedule
            </Button>
            <Button variant="danger" onClick={() => setCancelOpen(true)}>
              Cancel booking
            </Button>
          </div>
        ) : null}
        <a className="mt-4 block text-center text-[13px] text-[#9ca3af]" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </div>

      <BottomSheet open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reschedule">
        <p className="mb-3 text-[13px] leading-5 text-[#9ca3af]">{CANCEL_POLICY} Moving a flight inside 48 hours can incur the $200 fee.</p>
        <Calendar value={date} onChange={setDate} />
        <div className="mt-3">
          <TimeSlotChips value={slot} onChange={setSlot} />
        </div>
        <Button
          className="mt-3"
          disabled={!date || !slot}
          onClick={() => {
            if (!slot) return;
            app.reschedule(booking.id, date, slot);
            setRescheduleOpen(false);
          }}
        >
          Confirm new time
        </Button>
      </BottomSheet>

      <BottomSheet open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel booking">
        <p className="text-[14px] leading-5">{CANCEL_POLICY}</p>
        {late ? <p className="mt-3 rounded-[14px] bg-danger/15 p-3 text-[13px] leading-5 text-danger">This flight is inside 48 hours. Cancelling now incurs a $200 fee.</p> : <p className="mt-3 text-[13px] text-lime">You are outside the 48-hour window.</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {cancelReasons.map((item) => (
            <button key={item} type="button" onClick={() => setReason(item)} className={`press min-h-11 rounded-full px-3 text-[13px] ${reason === item ? "bg-lime text-ink" : "border border-line"}`}>
              {item}
            </button>
          ))}
        </div>
        <Button
          variant="danger"
          className="mt-4"
          onClick={() => {
            app.cancelBooking(booking.id, reason);
            setCancelOpen(false);
          }}
        >
          Confirm cancellation
        </Button>
      </BottomSheet>
    </Screen>
  );
}
