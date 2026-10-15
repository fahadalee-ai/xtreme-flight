export const PHONE_DISPLAY = "601-XFLIGHT (601-935-4448)";
export const PHONE_TEL = "+16019354448";
export const EMAIL = "info@xtreme-flight.com";
export const ADDRESS = "Wings Field (2TN2), 580 Farris Rd, Whiteville, TN 38075";
export const ADDRESS_SHORT = "580 Farris Rd, Whiteville, TN 38075";
export const MAPS_QUERY = "Wings Field, 580 Farris Rd, Whiteville, TN 38075";

export const BASE_INCLUSIONS = [
  "Flight with a Certified Flight Instructor",
  "Headset and intercom",
  "Parachute and 5-point harness",
  "Ground briefing",
  "FAA-legal logbook entry",
  "Mounted GoPro footage",
];

export const VIDEO_INCLUSION =
  "Professionally edited HD video, delivered within 1–7 business days";

export const PRICE_PROMISE =
  "The price you see is the price you pay. No upsells. No fuel surcharges.";

export const CANCEL_POLICY =
  "We require a 48-hour cancellation notice. Cancellations made inside of 48 hours will incur a $200 cancellation fee. No-shows will also be charged $200.";

export const WEATHER_POLICY =
  "If weather, mechanical, or other issues prevent the flight, you are not charged and you are offered a new date.";

export const RISK_COPY =
  "No form of aviation or adventurous activity is without risk. By choosing to fly, you acknowledge and accept these inherent risks, which include the risk of injury or death.";

export function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const SLOT_TIME = {
  Morning: "9:00 AM",
  Midday: "12:30 PM",
  Afternoon: "3:00 PM",
} as const;

export type Slot = keyof typeof SLOT_TIME;

export function flightDate(iso: string, slot: Slot) {
  const [y, m, d] = iso.split("-").map(Number);
  const hours = slot === "Morning" ? 9 : slot === "Midday" ? 12.5 : 15;
  return new Date(y, (m || 1) - 1, d || 1, Math.floor(hours), hours % 1 ? 30 : 0);
}

export function within48(iso: string, slot: Slot) {
  return flightDate(iso, slot).getTime() - Date.now() < 48 * 3600 * 1000;
}

export function daysUntil(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function heightLabel(inches: number) {
  const f = Math.floor(inches / 12);
  const i = inches % 12;
  return `${f}'${i}"`;
}

export function ageFromDob(dob: string) {
  if (!dob) return 0;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function phoneOk(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

export function uid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function mapsLinks() {
  const q = encodeURIComponent(MAPS_QUERY);
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    apple: `https://maps.apple.com/?q=${q}`,
  };
}

export function tap() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(8);
  }
}
