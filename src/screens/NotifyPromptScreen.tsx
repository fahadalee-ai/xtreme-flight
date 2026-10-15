import { Bell } from "lucide-react";
import { Button, Header, Screen } from "@/components/chrome";
import { useApp } from "@/store/app-store";
import { useGo } from "@/lib/nav";

export function NotifyPromptScreen() {
  const app = useApp();
  const go = useGo();
  const done = (allow: boolean) => {
    app.updateUser({ notifSeen: true });
    if (allow) app.updatePrefs({ bookings: true, reminders: true, weather: true, media: true, email: true });
    const dest = app.redirect;
    app.setRedirect(null);
    app.pushToast(allow ? "Notifications on" : "You can turn these on later");
    go(dest || "/home");
  };
  return (
    <Screen>
      <Header title="Notifications" back="/home" />
      <div className="ios-stack">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/15 text-lime">
          <Bell />
        </div>
        <h1 className="mt-4 font-display text-[32px] uppercase leading-9">Stay ahead of flight day</h1>
        <ul className="mt-4 space-y-3 text-[15px] leading-[22px] text-[#d1d5db]">
          <li>Reminders at 7 days, 48 hours, and the morning you fly.</li>
          <li>Weather updates and delay or cancellation alerts.</li>
          <li>A ping when your flight video is ready.</li>
        </ul>
        <div className="mt-6 space-y-3">
          <Button onClick={() => done(true)}>Allow notifications</Button>
          <Button variant="outline" onClick={() => done(false)}>
            Not now
          </Button>
        </div>
      </div>
    </Screen>
  );
}
