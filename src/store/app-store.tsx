import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createSeed } from "@/data/seed";
import type {
  AppNotification,
  Booking,
  BookingStatus,
  Card,
  Certificate,
  MediaItem,
  NotifPrefs,
  PackageId,
  Passenger,
  Receipt,
  Review,
  User,
} from "@/data/types";
import { copy, type CopyKey, type Lang } from "@/data/i18n";
import { isoDaysFromNow, uid, type Slot } from "@/lib/format";

const KEY = "xf-state-v1";
const AUTH = "xf-auth";

export type Toast = { id: number; title: string; body?: string };
export type Intent = { type: "reschedule" | "cancel"; bookingId: string } | null;

type Snapshot = ReturnType<typeof createSeed>;

type AuthBag = { userId: string | null; guest: boolean };

type Store = {
  hydrated: boolean;
  onboarded: boolean;
  user: User | null;
  guest: boolean;
  language: Lang;
  t: (key: CopyKey) => string;
  markOnboarded: () => void;
  setLanguage: (lang: Lang) => void;
  emailExists: (email: string) => boolean;
  login: (email: string, password: string, remember: boolean) => { ok: true; user: User };
  register: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    dob: string;
  }) => { ok: true; user: User };
  social: (provider: "Apple" | "Google") => User;
  continueAsGuest: () => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  changePassword: (current: string, next: string) => { ok: true } | { ok: false; reason: string };
  resetPassword: (email: string, next: string) => { ok: true } | { ok: false; reason: string };
  deleteAccount: () => void;
  bookings: Booking[];
  createBooking: (input: {
    packageId: PackageId;
    parachute: boolean;
    date: string;
    slot: Slot;
    passengers: Passenger[];
    count: number;
    total: number;
    paidWith: string;
    promo?: string;
  }) => Booking | null;
  reschedule: (id: string, date: string, slot: Slot) => void;
  cancelBooking: (id: string, reason: string) => void;
  rateBooking: (id: string, stars: number, title: string, text: string) => void;
  certificates: Certificate[];
  buyCertificate: (input: Omit<Certificate, "id" | "code" | "userId" | "status" | "history">) => Certificate | null;
  findCertificate: (code: string) => Certificate | undefined;
  consumeCertificate: (code: string, ref: string) => void;
  media: MediaItem[];
  toggleFavorite: (id: string) => void;
  unlockVideo: (id: string) => void;
  notifications: AppNotification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  prefs: NotifPrefs;
  updatePrefs: (patch: Partial<NotifPrefs>) => void;
  cards: Card[];
  addCard: (card: Omit<Card, "id">) => void;
  receipts: Receipt[];
  passengers: Passenger[];
  savePassenger: (p: Passenger) => void;
  removePassenger: (id: string) => void;
  reviews: Review[];
  checklist: Record<string, boolean>;
  toggleCheck: (id: string) => void;
  toasts: Toast[];
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
  banner: AppNotification | null;
  dismissBanner: () => void;
  redirect: string | null;
  setRedirect: (path: string | null) => void;
  preselect: PackageId | null;
  setPreselect: (id: PackageId | null) => void;
  intent: Intent;
  setIntent: (intent: Intent) => void;
};

const Ctx = createContext<Store | null>(null);

function readAuth(): AuthBag {
  if (typeof window === "undefined") return { userId: null, guest: false };
  const raw = localStorage.getItem(AUTH) || sessionStorage.getItem(AUTH);
  if (!raw) return { userId: null, guest: false };
  try {
    return JSON.parse(raw) as AuthBag;
  } catch {
    return { userId: null, guest: false };
  }
}

function writeAuth(bag: AuthBag | null, remember: boolean) {
  localStorage.removeItem(AUTH);
  sessionStorage.removeItem(AUTH);
  if (!bag) return;
  const target = remember ? localStorage : sessionStorage;
  target.setItem(AUTH, JSON.stringify(bag));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const seed = useMemo(() => createSeed(), []);
  const [snap, setSnap] = useState<Snapshot>(seed);
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState(false);
  const [guestLang, setGuestLang] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banner, setBanner] = useState<AppNotification | null>(null);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [preselect, setPreselect] = useState<PackageId | null>(null);
  const [intent, setIntent] = useState<Intent>(null);
  const [bannerShown, setBannerShown] = useState(false);

  const pushToast = (title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, title, body }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3400);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw) as Snapshot & { onboarded?: boolean; guestLang?: Lang; checklist?: Record<string, boolean> };
        setSnap({
          users: data.users?.length ? data.users : seed.users,
          bookings: data.bookings || seed.bookings,
          certificates: data.certificates || seed.certificates,
          media: data.media || seed.media,
          notifications: data.notifications || seed.notifications,
          reviews: data.reviews || [],
          cards: data.cards || seed.cards,
          receipts: data.receipts || seed.receipts,
          passengers: data.passengers || seed.passengers,
          prefs: data.prefs || seed.prefs,
          nextRef: data.nextRef || seed.nextRef,
        });
        setOnboarded(Boolean(data.onboarded));
        setGuestLang(data.guestLang || "en");
        setChecklist(data.checklist || {});
      }
    } catch {
      /* keep seed */
    }
    const auth = readAuth();
    if (auth.userId) {
      const raw = localStorage.getItem(KEY);
      let users = seed.users;
      if (raw) {
        try {
          users = (JSON.parse(raw) as Snapshot).users || seed.users;
        } catch {
          /* seed */
        }
      }
      setUser(users.find((u) => u.id === auth.userId) ?? null);
    }
    setGuest(auth.guest && !auth.userId);
    setHydrated(true);
  }, [seed]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = { ...snap, onboarded, guestLang, checklist };
    localStorage.setItem(KEY, JSON.stringify(payload));
  }, [hydrated, snap, onboarded, guestLang, checklist]);

  useEffect(() => {
    if (!hydrated || !user || bannerShown) return;
    const note = snap.notifications.find((n) => n.userId === user.id && !n.read && n.category === "Media");
    if (note) {
      setBanner(note);
      setBannerShown(true);
    }
  }, [hydrated, user, snap.notifications, bannerShown]);

  const language: Lang = user?.language || guestLang;

  const value = useMemo<Store>(() => {
    const patchSnap = (partial: Partial<Snapshot>) => setSnap((s) => ({ ...s, ...partial }));

    return {
      hydrated,
      onboarded,
      user,
      guest,
      language,
      t: (key) => copy[language][key],
      markOnboarded: () => setOnboarded(true),
      setLanguage: (lang) => {
        setGuestLang(lang);
        if (user) {
          const next = { ...user, language: lang };
          setUser(next);
          patchSnap({ users: snap.users.map((u) => (u.id === next.id ? next : u)) });
        }
      },
      emailExists: (email) => snap.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()),
      login: (email, password, remember) => {
        const trimmed = email.trim().toLowerCase();
        const found = snap.users.find((u) => u.email.toLowerCase() === trimmed);
        if (found) {
          setUser(found);
          setGuest(false);
          setOnboarded(true);
          writeAuth({ userId: found.id, guest: false }, remember);
          return { ok: true, user: found };
        }
        const created: User = {
          id: uid("u"),
          name: trimmed ? trimmed.split("@")[0] : "Guest",
          email: trimmed || `guest-${Date.now()}@xtreme-flight.com`,
          phone: "",
          password: password || "guest",
          dob: "",
          address: "",
          emergencyName: "",
          emergencyPhone: "",
          heightIn: 0,
          weight: 0,
          trunk: 0,
          memberSince: isoDaysFromNow(0),
          language: guestLang,
          biometric: false,
          notifSeen: true,
        };
        patchSnap({ users: [...snap.users, created] });
        setUser(created);
        setGuest(false);
        setOnboarded(true);
        writeAuth({ userId: created.id, guest: false }, remember);
        return { ok: true, user: created };
      },
      register: (input) => {
        const trimmed = input.email.trim().toLowerCase();
        const existing = snap.users.find((u) => trimmed && u.email.toLowerCase() === trimmed);
        if (existing) {
          setUser(existing);
          setGuest(false);
          setOnboarded(true);
          writeAuth({ userId: existing.id, guest: false }, true);
          return { ok: true, user: existing };
        }
        const created: User = {
          id: uid("u"),
          name: input.name.trim() || "Guest",
          email: trimmed || `guest-${Date.now()}@xtreme-flight.com`,
          phone: input.phone.trim(),
          password: input.password || "guest",
          dob: input.dob,
          address: "",
          emergencyName: "",
          emergencyPhone: "",
          heightIn: 0,
          weight: 0,
          trunk: 0,
          memberSince: isoDaysFromNow(0),
          language: guestLang,
          biometric: false,
          notifSeen: false,
        };
        patchSnap({ users: [...snap.users, created] });
        setUser(created);
        setGuest(false);
        setOnboarded(true);
        writeAuth({ userId: created.id, guest: false }, true);
        return { ok: true, user: created };
      },
      social: (provider) => {
        const email = `${provider.toLowerCase()}.guest@xtreme-flight.com`;
        const existing = snap.users.find((u) => u.email === email);
        if (existing) {
          setUser(existing);
          setGuest(false);
          setOnboarded(true);
          writeAuth({ userId: existing.id, guest: false }, true);
          return existing;
        }
        const created: User = {
          id: uid("u"),
          name: provider === "Apple" ? "Apple Guest" : "Google Guest",
          email,
          phone: "",
          password: uid("pw"),
          dob: "1990-01-01",
          address: "",
          emergencyName: "",
          emergencyPhone: "",
          heightIn: 0,
          weight: 0,
          trunk: 0,
          memberSince: isoDaysFromNow(0),
          language: guestLang,
          biometric: false,
          notifSeen: false,
        };
        patchSnap({ users: [...snap.users, created] });
        setUser(created);
        setGuest(false);
        setOnboarded(true);
        writeAuth({ userId: created.id, guest: false }, true);
        return created;
      },
      continueAsGuest: () => {
        setUser(null);
        setGuest(true);
        setOnboarded(true);
        writeAuth({ userId: null, guest: true }, true);
      },
      logout: () => {
        setUser(null);
        setGuest(false);
        writeAuth(null, true);
        pushToast("Logged out");
      },
      updateUser: (patch) => {
        if (!user) return;
        const next = { ...user, ...patch };
        setUser(next);
        patchSnap({ users: snap.users.map((u) => (u.id === next.id ? next : u)) });
      },
      resetPassword: (email, next) => {
        const found = snap.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!found) return { ok: false, reason: "Account not found." };
        if (next.length < 8) return { ok: false, reason: "Use at least 8 characters." };
        const updated = { ...found, password: next };
        patchSnap({ users: snap.users.map((u) => (u.id === updated.id ? updated : u)) });
        if (user?.id === updated.id) setUser(updated);
        return { ok: true };
      },
      changePassword: (current, next) => {
        if (!user) return { ok: false, reason: "Sign in first." };
        if (user.password !== current) return { ok: false, reason: "Current password doesn't match." };
        if (next.length < 8) return { ok: false, reason: "Use at least 8 characters." };
        const updated = { ...user, password: next };
        setUser(updated);
        patchSnap({ users: snap.users.map((u) => (u.id === updated.id ? updated : u)) });
        return { ok: true };
      },
      deleteAccount: () => {
        if (!user) return;
        patchSnap({
          users: snap.users.filter((u) => u.id !== user.id),
          bookings: snap.bookings.filter((b) => b.userId !== user.id),
        });
        setUser(null);
        setGuest(false);
        writeAuth(null, true);
        pushToast("Account deleted on this device");
      },
      bookings: snap.bookings,
      createBooking: (input) => {
        if (!user) return null;
        const ref = `XF-2026-${String(snap.nextRef).padStart(4, "0")}`;
        const booking: Booking = {
          id: uid("b"),
          ref,
          userId: user.id,
          packageId: input.packageId,
          parachute: input.parachute,
          date: input.date,
          slot: input.slot,
          status: "Confirmed",
          passengers: input.passengers,
          count: input.count,
          total: input.total,
          paidWith: input.paidWith,
          createdAt: isoDaysFromNow(0),
          promo: input.promo,
        };
        const note: AppNotification = {
          id: uid("n"),
          userId: user.id,
          category: "Bookings",
          title: "Booking confirmed",
          body: `${ref} is confirmed. A copy was sent to ${user.email}.`,
          at: Date.now(),
          read: false,
        };
        const receipt: Receipt = {
          id: uid("r"),
          userId: user.id,
          ref,
          date: isoDaysFromNow(0),
          amount: input.total,
          method: input.paidWith,
          detail: input.packageId,
        };
        patchSnap({
          bookings: [booking, ...snap.bookings],
          notifications: [note, ...snap.notifications],
          receipts: [receipt, ...snap.receipts],
          nextRef: snap.nextRef + 1,
        });
        pushToast("Booking confirmed", ref);
        setTimeout(() => pushToast("Email sent", `Confirmation sent to ${user.email}`), 800);
        return booking;
      },
      reschedule: (id, date, slot) => {
        patchSnap({
          bookings: snap.bookings.map((b) => (b.id === id ? { ...b, date, slot, status: "Rescheduled" as BookingStatus } : b)),
        });
        if (user) {
          const note: AppNotification = {
            id: uid("n"),
            userId: user.id,
            category: "Bookings",
            title: "Flight rescheduled",
            body: `Your new time is locked in. We'll watch the weather as the day gets closer.`,
            at: Date.now(),
            read: false,
          };
          patchSnap({
            bookings: snap.bookings.map((b) => (b.id === id ? { ...b, date, slot, status: "Rescheduled" } : b)),
            notifications: [note, ...snap.notifications],
          });
        }
        pushToast("Flight rescheduled");
      },
      cancelBooking: (id, reason) => {
        const current = snap.bookings.find((b) => b.id === id);
        patchSnap({
          bookings: snap.bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
        });
        if (user && current) {
          const note: AppNotification = {
            id: uid("n"),
            userId: user.id,
            category: "Bookings",
            title: "Booking cancelled",
            body: `${current.ref} was cancelled. Reason: ${reason}.`,
            at: Date.now(),
            read: false,
          };
          patchSnap({
            bookings: snap.bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
            notifications: [note, ...snap.notifications],
          });
        }
        pushToast("Booking cancelled");
      },
      rateBooking: (id, stars, title, text) => {
        if (!user) return;
        patchSnap({
          bookings: snap.bookings.map((b) => (b.id === id ? { ...b, rating: stars } : b)),
          reviews: [
            {
              id: uid("rv"),
              userId: user.id,
              name: user.name,
              role: "Passenger",
              location: "Wings Field",
              stars,
              title,
              text,
              pending: true,
            },
            ...snap.reviews,
          ],
        });
        pushToast("Review submitted for approval");
      },
      certificates: snap.certificates,
      buyCertificate: (input) => {
        if (!user) return null;
        const cert: Certificate = {
          ...input,
          id: uid("gc"),
          code: `XF-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          userId: user.id,
          status: "Active",
          history: [{ date: isoDaysFromNow(0), note: "Issued" }],
        };
        const note: AppNotification = {
          id: uid("n"),
          userId: user.id,
          category: "Payments",
          title: "Gift certificate sent",
          body: `${cert.code} is on its way to ${cert.recipientName}.`,
          at: Date.now(),
          read: false,
        };
        patchSnap({
          certificates: [cert, ...snap.certificates],
          notifications: [note, ...snap.notifications],
        });
        pushToast("Gift certificate ready", cert.code);
        return cert;
      },
      findCertificate: (code) => snap.certificates.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()),
      consumeCertificate: (code, ref) => {
        patchSnap({
          certificates: snap.certificates.map((c) =>
            c.code.toLowerCase() === code.trim().toLowerCase()
              ? {
                  ...c,
                  status: "Redeemed",
                  history: [...c.history, { date: isoDaysFromNow(0), note: `Redeemed on ${ref}` }],
                }
              : c,
          ),
        });
      },
      media: snap.media,
      toggleFavorite: (id) => {
        patchSnap({ media: snap.media.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m)) });
      },
      unlockVideo: (id) => {
        if (!user) return;
        patchSnap({
          media: snap.media.map((m) => (m.id === id ? { ...m, status: "Purchased", title: "Video added — editing" } : m)),
          receipts: [
            {
              id: uid("r"),
              userId: user.id,
              ref: "VIDEO-ADD",
              date: isoDaysFromNow(0),
              amount: 180,
              method: "Visa ••4242",
              detail: "Add video to flight",
            },
            ...snap.receipts,
          ],
        });
        pushToast("Video added", "Your edit will arrive within 1–7 business days.");
      },
      notifications: snap.notifications,
      markRead: (id) => {
        patchSnap({ notifications: snap.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
      },
      markAllRead: () => {
        if (!user) return;
        patchSnap({
          notifications: snap.notifications.map((n) => (n.userId === user.id ? { ...n, read: true } : n)),
        });
      },
      prefs: snap.prefs,
      updatePrefs: (patch) => patchSnap({ prefs: { ...snap.prefs, ...patch } }),
      cards: snap.cards,
      addCard: (card) => patchSnap({ cards: [...snap.cards, { ...card, id: uid("card") }] }),
      receipts: snap.receipts,
      passengers: snap.passengers,
      savePassenger: (p) => {
        const exists = snap.passengers.some((x) => x.id === p.id);
        patchSnap({
          passengers: exists ? snap.passengers.map((x) => (x.id === p.id ? p : x)) : [p, ...snap.passengers],
        });
        pushToast("Passenger saved");
      },
      removePassenger: (id) => patchSnap({ passengers: snap.passengers.filter((p) => p.id !== id) }),
      reviews: snap.reviews,
      checklist,
      toggleCheck: (id) => setChecklist((c) => ({ ...c, [id]: !c[id] })),
      toasts,
      pushToast,
      dismissToast: (id) => setToasts((list) => list.filter((t) => t.id !== id)),
      banner,
      dismissBanner: () => setBanner(null),
      redirect,
      setRedirect,
      preselect,
      setPreselect,
      intent,
      setIntent,
    };
  }, [hydrated, onboarded, user, guest, guestLang, language, snap, checklist, toasts, banner, redirect, preselect, intent]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function useMine() {
  const app = useApp();
  const id = app.user?.id;
  return {
    bookings: app.bookings.filter((b) => b.userId === id),
    media: app.media.filter((m) => m.userId === id),
    notes: app.notifications.filter((n) => n.userId === id),
    certs: app.certificates.filter((c) => c.userId === id),
    receipts: app.receipts.filter((r) => r.userId === id),
    unread: app.notifications.filter((n) => n.userId === id && !n.read).length,
  };
}
