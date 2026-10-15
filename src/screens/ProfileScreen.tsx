import { useState, type ReactNode } from "react";
import { Bell, CalendarCheck, Clapperboard, CreditCard, FileText, Gift, History, Info, Languages, LifeBuoy, Shield, UserRound, Users } from "lucide-react";
import { images } from "@/img/images";
import { BottomSheet } from "@/components/BottomSheet";
import { Button, LargeTitle, RowLink, Screen } from "@/components/chrome";
import { useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";

const sections: { title: string; guest?: boolean; items: { to: string; label: string; detail: string; icon: ReactNode }[] }[] = [
  {
    title: "Account",
    items: [
      { to: "/profile/info", label: "Personal information", detail: "Name, contact, height and weight", icon: <UserRound size={16} /> },
      { to: "/profile/payments", label: "Payments and receipts", detail: "Cards and downloads", icon: <CreditCard size={16} /> },
      { to: "/profile/passengers", label: "Saved passengers", detail: "Faster booking next time", icon: <Users size={16} /> },
      { to: "/profile/privacy", label: "Privacy and security", detail: "Password, biometrics, delete account", icon: <Shield size={16} /> },
    ],
  },
  {
    title: "Flying",
    items: [
      { to: "/bookings", label: "Upcoming flights", detail: "Confirmed dates and weather", icon: <CalendarCheck size={16} /> },
      { to: "/bookings", label: "Booking history", detail: "Completed and cancelled", icon: <History size={16} /> },
      { to: "/media", label: "My media", detail: "Videos and photos", icon: <Clapperboard size={16} /> },
      { to: "/gifts", label: "Gift certificates", detail: "Buy, send, redeem", icon: <Gift size={16} /> },
    ],
  },
  {
    title: "Preferences",
    guest: true,
    items: [
      { to: "/settings/notifications", label: "Notifications", detail: "Alerts, email, quiet hours", icon: <Bell size={16} /> },
      { to: "/profile/language", label: "Language", detail: "English or Spanish", icon: <Languages size={16} /> },
    ],
  },
  {
    title: "Support",
    guest: true,
    items: [
      { to: "/support", label: "Help and support", detail: "FAQ, call, contact", icon: <LifeBuoy size={16} /> },
      { to: "/profile/about", label: "About Xtreme Flight", detail: "The XA-42 and the crew", icon: <Info size={16} /> },
      { to: "/profile/terms", label: "Terms and privacy", detail: "Risk, weather, cancellation", icon: <FileText size={16} /> },
      { to: "/location", label: "Wings Field", detail: "580 Farris Rd, Whiteville", icon: <Info size={16} /> },
    ],
  },
];

export function ProfileScreen() {
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const [out, setOut] = useState(false);
  const flights = mine.bookings.filter((b) => b.status === "Completed").length;
  const stats = [
    [String(flights), "Flights"],
    [String(mine.media.filter((m) => m.status === "Ready").length), "Videos"],
    [String(mine.certs.filter((c) => c.status === "Active").length), "Gifts"],
  ];

  return (
    <Screen tab>
      <LargeTitle title={app.t("profile")} />
      {app.user ? (
        <div className="mx-4 rounded-[16px] bg-[#1f2937] p-4">
          <div className="flex items-center gap-4">
            <label className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full bg-[#273244]">
              {app.user.avatar ? <img src={app.user.avatar} alt="" className="h-full w-full object-cover" /> : <img src={images.logo} alt="" className="logo-knockout h-full w-full object-contain p-2" />}
              <input
                aria-label="Change profile photo"
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => app.updateUser({ avatar: String(reader.result) });
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <div className="min-w-0">
              <p className="truncate text-[22px] font-bold leading-7 tracking-tight text-white">{app.user.name}</p>
              <p className="truncate text-[15px] leading-5 text-[#d1d5db]">{app.user.email}</p>
              <p className="mt-0.5 text-[13px] leading-[18px] text-[#9ca3af]">Member since {app.user.memberSince}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 border-t border-white/10 pt-3 text-center">
            {stats.map(([n, label]) => (
              <div key={label}>
                <p className="text-[22px] font-bold leading-7 text-lime">{n}</p>
                <p className="text-[13px] leading-[18px] text-[#d1d5db]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-4 rounded-[16px] bg-[#1f2937] p-4">
          <p className="text-[20px] font-bold leading-6 text-white">You're browsing as a guest</p>
          <p className="mt-1 text-[15px] leading-[22px] text-[#d1d5db]">Sign in to see bookings, videos, and gift certificates.</p>
          <div className="mt-4 space-y-3">
            <Button onClick={() => go("/login")}>{app.t("login")}</Button>
            <Button variant="outline" onClick={() => go("/register")}>{app.t("create")}</Button>
          </div>
        </div>
      )}

      {sections
        .filter((section) => app.user || section.guest)
        .map((section) => (
          <section key={section.title} className="mt-6">
            <h2 className="mb-2 px-5 text-[13px] font-semibold uppercase tracking-wide text-[#9ca3af]">{section.title}</h2>
            <div className="ios-group">
              {section.items.map((item) => (
                <RowLink key={item.label} icon={item.icon} label={item.label} detail={item.detail} onClick={() => go(item.to)} />
              ))}
            </div>
          </section>
        ))}

      {app.user ? (
        <div className="mx-4 mb-2 mt-6">
          <button type="button" className="min-h-[50px] w-full rounded-[12px] bg-[#1f2937] text-[17px] font-semibold text-[#f87171]" onClick={() => setOut(true)}>
            Log Out
          </button>
        </div>
      ) : null}

      <BottomSheet open={out} onClose={() => setOut(false)} title="Log out">
        <p className="text-[15px] leading-[22px] text-[#d1d5db]">Log out of Xtreme Flight on this device?</p>
        <div className="mt-4 space-y-2">
          <Button
            variant="danger"
            onClick={() => {
              setOut(false);
              app.logout();
              go("/login");
            }}
          >
            Log Out
          </Button>
          <Button variant="outline" onClick={() => setOut(false)}>
            Stay signed in
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
