import type { Slot } from "@/lib/format";

export type PackageId = "xtreme" | "video" | "youfly";

export type Package = {
  id: PackageId;
  name: string;
  minutes: string;
  price: number;
  blurb: string;
  badge?: "Most Popular" | "Ultimate";
  video: boolean;
  pilotControl: boolean;
  bestFor: string;
};

export type BookingStatus =
  | "Confirmed"
  | "Pending"
  | "Weather Watch"
  | "Delayed"
  | "Rescheduling Needed"
  | "Rescheduled"
  | "Completed"
  | "Cancelled"
  | "Cancelled by Operator";

export type Passenger = {
  id: string;
  name: string;
  age: number;
  heightIn: number;
  weight: number;
  trunk: number;
  email: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  requests: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
};

export type Booking = {
  id: string;
  ref: string;
  userId: string;
  packageId: PackageId;
  parachute: boolean;
  date: string;
  slot: Slot;
  status: BookingStatus;
  passengers: Passenger[];
  count: number;
  total: number;
  paidWith: string;
  createdAt: string;
  promo?: string;
  rating?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  dob: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  heightIn: number;
  weight: number;
  trunk: number;
  memberSince: string;
  language: "en" | "es";
  biometric: boolean;
  notifSeen: boolean;
  avatar?: string;
};

export type Certificate = {
  id: string;
  code: string;
  userId: string;
  packageId?: PackageId;
  amount: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  status: "Active" | "Redeemed" | "Expired";
  expires: string;
  delivery: string;
  history: { date: string; note: string }[];
};

export type MediaStatus = "Processing" | "Ready" | "Purchased" | "Locked";

export type MediaItem = {
  id: string;
  userId: string;
  bookingId?: string;
  kind: "video" | "photo";
  title: string;
  duration?: string;
  status: MediaStatus;
  src: string;
  poster?: string;
  favorite: boolean;
};

export type NoteCategory = "Bookings" | "Reminders" | "Weather" | "Payments" | "Media";

export type AppNotification = {
  id: string;
  userId: string;
  category: NoteCategory;
  title: string;
  body: string;
  at: number;
  read: boolean;
};

export type NotifPrefs = {
  bookings: boolean;
  reminders: boolean;
  weather: boolean;
  payments: boolean;
  media: boolean;
  email: boolean;
  sms: boolean;
  quiet: boolean;
  quietStart: string;
  quietEnd: string;
};

export type Card = { id: string; brand: string; last4: string; exp: string };
export type Receipt = { id: string; userId: string; ref: string; date: string; amount: number; method: string; detail: string };

export type Review = {
  id: string;
  userId?: string;
  name: string;
  role: string;
  location: string;
  stars: number;
  title: string;
  text: string;
  photo?: string;
  pending?: boolean;
};

export type Faq = { id: string; category: string; q: string; a: string };
export type Article = { slug: string; title: string; minutes: string; paragraphs: string[] };
