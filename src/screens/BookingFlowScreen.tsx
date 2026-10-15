import { useState } from "react";
import { Button, CheckField, GuestWall, Header, PolicyNote, Screen, StickyBar, TextArea, TextField } from "@/components/chrome";
import { Calendar } from "@/components/Calendar";
import { TimeSlotChips } from "@/components/TimeSlotChips";
import { Stepper } from "@/components/Stepper";
import { PARACHUTE, packages } from "@/data/content";
import { packageById } from "@/data/content";
import type { PackageId, Passenger } from "@/data/types";
import { checkEligibility } from "@/lib/eligibility";
import {
  ADDRESS,
  CANCEL_POLICY,
  PRICE_PROMISE,
  RISK_COPY,
  SLOT_TIME,
  WEATHER_POLICY,
  formatDate,
  isoDaysFromNow,
  mapsLinks,
  money,
  uid,
  type Slot,
} from "@/lib/format";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";
import { ShareSheet } from "@/components/ShareSheet";
import { SkeletonPage } from "@/components/Skeleton";

const STEPS = 7;

export function BookingFlowScreen() {
  const app = useApp();
  const go = useGo();
  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState<PackageId>(app.preselect || "video");
  const [parachute, setParachute] = useState(false);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<Slot | "">("");
  const [count, setCount] = useState(1);
  const [name, setName] = useState(app.user?.name || "");
  const [age, setAge] = useState("");
  const [feet, setFeet] = useState(app.user?.heightIn ? String(Math.floor(app.user.heightIn / 12)) : "");
  const [inches, setInches] = useState(app.user?.heightIn ? String(app.user.heightIn % 12) : "");
  const [weight, setWeight] = useState(app.user?.weight ? String(app.user.weight) : "");
  const [trunk, setTrunk] = useState(app.user?.trunk ? String(app.user.trunk) : "");
  const [email, setEmail] = useState(app.user?.email || "");
  const [phone, setPhone] = useState(app.user?.phone || "");
  const [emergencyName, setEmergencyName] = useState(app.user?.emergencyName || "");
  const [emergencyPhone, setEmergencyPhone] = useState(app.user?.emergencyPhone || "");
  const [requests, setRequests] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [eligibleOk, setEligibleOk] = useState(false);
  const [riskOk, setRiskOk] = useState(false);
  const [cancelOk, setCancelOk] = useState(false);
  const [weatherOk, setWeatherOk] = useState(false);
  const [signature, setSignature] = useState("");
  const [promo, setPromo] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "applied" | "invalid" | "expired" | "used">("idle");
  const [discount, setDiscount] = useState(0);
  const [pay, setPay] = useState<"Card" | "Apple Pay" | "Google Pay">("Card");
  const [cardName, setCardName] = useState(app.user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [receipt, setReceipt] = useState(true);
  const [done, setDone] = useState<string>("");
  const [shareOpen, setShareOpen] = useState(false);

  const pkg = packageById(packageId) || packages[1];
  const heightIn = (Number(feet) || 0) * 12 + (Number(inches) || 0);
  const ageN = Number(age) || 0;
  const minor = ageN > 0 && ageN < 18;
  const subtotal = (pkg.price + (parachute ? PARACHUTE.price : 0)) * count;
  const total = Math.max(0, subtotal - discount);

  const eligibility = checkEligibility({
    age: ageN,
    weight: Number(weight) || 0,
    heightIn,
    trunk: Number(trunk) || 0,
    pregnant: false,
    canBoard: true,
    backNeck: false,
  });

  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) {
    return <GuestWall title="Book a Flight" body="Sign in to hold a date. You can still browse packages, the aircraft, FAQ, and the field as a guest." />;
  }

  const applyPromo = () => {
    if (!promo.trim()) {
      setPromoState("idle");
      setDiscount(0);
      return;
    }
    const cert = app.findCertificate(promo);
    if (!cert) {
      setPromoState("invalid");
      setDiscount(0);
      return;
    }
    if (cert.status === "Redeemed") {
      setPromoState("used");
      setDiscount(0);
      return;
    }
    if (cert.status === "Expired") {
      setPromoState("expired");
      setDiscount(0);
      return;
    }
    setPromoState("applied");
    setDiscount(Math.min(subtotal, cert.amount));
  };

  const payNow = () => {
    const chosenSlot: Slot = slot || "Morning";
    const chosenDate = date || isoDaysFromNow(14);
    const digits = cardNumber.replace(/\D/g, "");
    const passenger: Passenger = {
      id: uid("p"),
      name: name.trim() || app.user?.name || "Guest",
      age: ageN,
      heightIn,
      weight: Number(weight) || 0,
      trunk: Number(trunk) || 0,
      email: email.trim() || app.user?.email || "",
      phone,
      emergencyName,
      emergencyPhone,
      requests,
      isMinor: minor,
      guardianName: minor ? guardianName : undefined,
      guardianPhone: minor ? guardianPhone : undefined,
    };
    const booking = app.createBooking({
      packageId,
      parachute,
      date: chosenDate,
      slot: chosenSlot,
      passengers: [passenger],
      count: count || 1,
      total,
      paidWith: pay === "Card" ? (digits ? `Card ••${digits.slice(-4)}` : "Card") : pay,
      promo: promoState === "applied" ? promo.trim().toUpperCase() : undefined,
    });
    if (booking && promoState === "applied") app.consumeCertificate(promo, booking.ref);
    if (receipt) app.pushToast("Receipt emailed", email);
    setDone(booking?.id || "");
  };

  if (done) {
    const booking = app.bookings.find((b) => b.id === done);
    if (!booking) return null;
    return (
      <Screen>
        <div className="px-4 pt-10 text-center">
          <div className="check-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime text-4xl text-ink">✓</div>
          <h1 className="mt-4 font-display text-[32px] uppercase leading-9">You're booked</h1>
          <p className="mt-2 text-[15px] text-[#9ca3af]">Reference</p>
          <p className="font-display text-[28px] tracking-wide text-lime">{booking.ref}</p>
          <p className="mt-2 text-[14px] leading-5">
            {pkg.name}
            <br />
            {formatDate(booking.date)} · {booking.slot} · {SLOT_TIME[booking.slot]}
            <br />
            {ADDRESS}
          </p>
          <div className="mt-5 space-y-2 text-left">
            <Button
              variant="outline"
              onClick={() => {
                const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Xtreme Flight ${booking.ref}\nDESCRIPTION:${pkg.name} at Wings Field\nDTSTART:${booking.date.replace(/-/g, "")}T140000Z\nEND:VEVENT\nEND:VCALENDAR`;
                const blob = new Blob([ics], { type: "text/calendar" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `${booking.ref}.ics`;
                a.click();
              }}
            >
              Add to calendar
            </Button>
            <Button variant="outline" onClick={() => setShareOpen(true)}>
              Share
            </Button>
            <Button variant="outline" onClick={() => window.open(mapsLinks().google, "_blank", "noopener,noreferrer")}>
              Directions
            </Button>
          </div>
          <article className="card mt-4 p-4 text-left text-[14px] leading-5">
            <p className="font-display text-[16px] uppercase text-white">What to bring</p>
            <p className="mt-2 text-[#d1d5db]">Government ID, comfortable clothes, flat shoes, and a hair tie if you need one. Leave jewelry and your phone with the crew.</p>
          </article>
          <Button className="mt-4" onClick={() => go(`/bookings/${booking.id}`)}>
            View Booking
          </Button>
        </div>
        <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} url="https://xtreme-flight.com/" />
      </Screen>
    );
  }

  return (
    <Screen className="pb-28">
      <Header
        title="Book a Flight"
        back={step === 0 ? "/home" : () => setStep((s) => Math.max(0, s - 1))}
      />
      <Stepper step={step} total={STEPS} />
      <div className="ios-stack">
        {step === 0 && (
          <>
            {packages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPackageId(item.id)}
                className={`card w-full p-4 text-left ${packageId === item.id ? "ring-2 ring-lime" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-[18px] uppercase">{item.name}</span>
                  <span className="text-lime">{money(item.price)}</span>
                </div>
                <p className="mt-1 text-[13px] text-[#9ca3af]">{item.minutes}</p>
              </button>
            ))}
            <CheckField checked={parachute} onChange={setParachute}>
              Special Parachute Add-On (+$100). Required under 5 feet.
            </CheckField>
            {heightIn > 0 && heightIn < 60 ? <PolicyNote>This height needs the parachute add-on.</PolicyNote> : null}
            <PolicyNote>{PRICE_PROMISE}</PolicyNote>
          </>
        )}
        {step === 1 && <Calendar anyDay value={date} onChange={setDate} />}
        {step === 2 && <TimeSlotChips value={slot} onChange={setSlot} />}
        {step === 3 && (
          <>
            <TextField label="Passengers" inputMode="numeric" value={String(count)} onChange={(v) => setCount(Math.min(6, Math.max(1, Number(v) || 1)))} hint="Each passenger is booked on this package." />
            <TextField label="Full name" value={name} onChange={setName} />
            <TextField label="Age" inputMode="numeric" value={age} onChange={setAge} />
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Height feet" inputMode="numeric" value={feet} onChange={setFeet} />
              <TextField label="Inches" inputMode="numeric" value={inches} onChange={setInches} />
            </div>
            <TextField label="Weight (lbs)" inputMode="decimal" value={weight} onChange={setWeight} />
            <TextField label="Trunk circumference (in)" inputMode="decimal" value={trunk} onChange={setTrunk} />
            <TextField label="Email" type="email" inputMode="email" value={email} onChange={setEmail} />
            <TextField label="Phone" type="tel" inputMode="tel" value={phone} onChange={setPhone} />
            <TextField label="Emergency contact name" value={emergencyName} onChange={setEmergencyName} />
            <TextField label="Emergency phone" type="tel" value={emergencyPhone} onChange={setEmergencyPhone} />
            <TextArea label="Special requests or maneuvers" value={requests} onChange={setRequests} />
            {minor ? (
              <>
                <PolicyNote>A parent or guardian must be present at the briefing.</PolicyNote>
                <TextField label="Parent or guardian name" value={guardianName} onChange={setGuardianName} />
                <TextField label="Parent or guardian phone" value={guardianPhone} onChange={setGuardianPhone} />
              </>
            ) : null}
            {ageN > 0 && heightIn > 0 ? (
              <p className="text-[13px] leading-5 text-[#9ca3af]">
                Eligibility preview: {eligibility.status}. {eligibility.reasons[0]}
              </p>
            ) : null}
            <CheckField checked={eligibleOk} onChange={setEligibleOk}>
              I confirm these details are accurate and the passenger meets, or will be reviewed against, the eligibility rules.
            </CheckField>
          </>
        )}
        {step === 4 && (
          <>
            <article className="card p-4 text-[14px] leading-5">
              <p>{RISK_COPY}</p>
              <p className="mt-3">{CANCEL_POLICY}</p>
              <p className="mt-3">{WEATHER_POLICY}</p>
            </article>
            <CheckField checked={riskOk} onChange={setRiskOk}>
              I acknowledge the risk of injury or death inherent in flight.
            </CheckField>
            <CheckField checked={cancelOk} onChange={setCancelOk}>
              I understand the 48-hour cancellation rule and the $200 fee.
            </CheckField>
            <CheckField checked={weatherOk} onChange={setWeatherOk}>
              I understand weather or mechanical cancellations are not charged.
            </CheckField>
            <TextField label="E-signature (type your full legal name)" value={signature} onChange={setSignature} />
          </>
        )}
        {step === 5 && (
          <>
            <TextField label="Gift certificate or promo code" value={promo} onChange={(v) => { setPromo(v); setPromoState("idle"); setDiscount(0); }} placeholder="XF-GIFT-7K2M" />
            <Button variant="outline" onClick={applyPromo}>
              Apply
            </Button>
            {promoState === "applied" ? <PolicyNote>Applied. Balance covers {money(discount)} of this booking.</PolicyNote> : null}
            {promoState === "invalid" ? <p className="text-[13px] text-danger">That code is not valid.</p> : null}
            {promoState === "expired" ? <p className="text-[13px] text-danger">That certificate has expired.</p> : null}
            {promoState === "used" ? <p className="text-[13px] text-danger">That certificate was already redeemed.</p> : null}
            <p className="text-[12px] leading-4 text-[#9ca3af]">Try XF-GIFT-7K2M, XF-USED-1001, or XF-OLD-2019 to see each state.</p>
          </>
        )}
        {step === 6 && (
          <>
            <article className="card p-4 text-[14px] leading-5">
              <p className="font-display text-[18px] uppercase">{pkg.name}</p>
              <p>{parachute ? "Parachute add-on included" : "No parachute add-on"}</p>
              <p>
                {date ? formatDate(date) : ""} · {slot} {slot ? SLOT_TIME[slot] : ""}
              </p>
              <p>{ADDRESS}</p>
              <p className="mt-2">
                {count} × {money(pkg.price + (parachute ? PARACHUTE.price : 0))}
                {discount ? ` − ${money(discount)}` : ""}
              </p>
              <p className="mt-2 font-display text-[24px] text-lime">{money(total)}</p>
              <p className="mt-2 text-[12px] leading-4 text-[#d9f99d]">{PRICE_PROMISE}</p>
              <p className="mt-2 text-[12px] leading-4 text-[#9ca3af]">{CANCEL_POLICY}</p>
            </article>
            <div className="grid grid-cols-3 gap-2">
              {(["Card", "Apple Pay", "Google Pay"] as const).map((method) => (
                <button key={method} type="button" onClick={() => setPay(method)} className={`press min-h-11 rounded-[14px] border px-2 text-[12px] ${pay === method ? "border-lime bg-lime text-ink" : "border-line"}`}>
                  {method}
                </button>
              ))}
            </div>
            {pay === "Card" ? (
              <>
                <TextField label="Name on card" value={cardName} onChange={setCardName} />
                <TextField label="Card number" inputMode="numeric" value={cardNumber} onChange={setCardNumber} placeholder="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-2">
                  <TextField label="Expiry" value={exp} onChange={setExp} placeholder="MM/YY" />
                  <TextField label="CVC" inputMode="numeric" value={cvc} onChange={setCvc} />
                </div>
              </>
            ) : (
              <PolicyNote>This preview confirms {pay} without charging a real card.</PolicyNote>
            )}
            <CheckField checked={receipt} onChange={setReceipt}>
              Email me a receipt
            </CheckField>
          </>
        )}
      </div>
      <StickyBar>
        <Button
          onClick={() => {
            if (step < 6) setStep((s) => s + 1);
            else payNow();
          }}
        >
          {step === 6 ? `Pay ${money(total)}` : "Continue"}
        </Button>
      </StickyBar>
    </Screen>
  );
}
