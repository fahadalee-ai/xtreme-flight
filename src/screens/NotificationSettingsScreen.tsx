import { Header, Screen, Switch } from "@/components/chrome";
import { useApp } from "@/store/app-store";
import type { NotifPrefs } from "@/data/types";

const rows: { key: keyof NotifPrefs; label: string; detail: string }[] = [
  { key: "bookings", label: "Bookings", detail: "Confirmations and status changes" },
  { key: "reminders", label: "Reminders", detail: "7 days, 48 hours, and day-of" },
  { key: "weather", label: "Weather", detail: "Watches, delays, and cancellations" },
  { key: "payments", label: "Payments", detail: "Receipts and failed payments" },
  { key: "media", label: "Media", detail: "When your video is ready" },
  { key: "email", label: "Email", detail: "Send the same alerts by email" },
  { key: "sms", label: "SMS", detail: "Text message alerts" },
  { key: "quiet", label: "Quiet hours", detail: "Hold non-urgent alerts overnight" },
];

export function NotificationSettingsScreen() {
  const app = useApp();
  return (
    <Screen>
      <Header title="Notification Settings" />
      <div className="ios-group">
        {rows.map((row) => (
          <div key={row.key} className="ios-row">
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] leading-[22px]">{row.label}</span>
              <span className="block text-[13px] leading-[18px] text-[#9ca3af]">{row.detail}</span>
            </span>
            <Switch checked={Boolean(app.prefs[row.key])} label={row.label} onChange={() => app.updatePrefs({ [row.key]: !app.prefs[row.key] })} />
          </div>
        ))}
      </div>
      <div className="ios-stack">
        <label className="ios-field">
          <span className="ios-field-label">Quiet from</span>
          <input className="field" type="time" value={app.prefs.quietStart} onChange={(e) => app.updatePrefs({ quietStart: e.target.value })} />
        </label>
        <label className="ios-field">
          <span className="ios-field-label">Until</span>
          <input className="field" type="time" value={app.prefs.quietEnd} onChange={(e) => app.updatePrefs({ quietEnd: e.target.value })} />
        </label>
      </div>
    </Screen>
  );
}
