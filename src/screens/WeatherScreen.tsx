import { useParams } from "@tanstack/react-router";
import { images } from "@/img/images";
import { Button, Header, PolicyNote, Screen } from "@/components/chrome";
import { StatusChip } from "@/components/StatusChip";
import { WEATHER_POLICY } from "@/lib/format";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";
import type { BookingStatus } from "@/data/types";

function forecast(status?: BookingStatus) {
  if (status === "Weather Watch" || status === "Delayed") {
    return { image: images.weatherCloudy, temp: "68°F", wind: "14 mph SW", vis: "6 mi", clouds: "Broken", fit: "Marginal — weather watch", tone: "Watch the afternoon build-up." };
  }
  if (status === "Rescheduling Needed" || status === "Cancelled by Operator") {
    return { image: images.weatherStorm, temp: "64°F", wind: "26 mph gusts", vis: "2 mi", clouds: "Overcast, rain", fit: "No-go", tone: "We will not fly in this. You will not be charged." };
  }
  return { image: images.weatherClear, temp: "78°F", wind: "8 mph", vis: "10 mi", clouds: "Few", fit: "Good to fly", tone: "Clear air over Wings Field." };
}

export function WeatherScreen() {
  const { bookingId } = useParams({ from: "/weather/$bookingId" });
  const app = useApp();
  const go = useGo();
  const booking = app.bookings.find((b) => b.id === bookingId);
  const wx = forecast(booking?.status);
  const notes = app.notifications.filter((n) => n.category === "Weather" || n.title.toLowerCase().includes("delay") || n.title.toLowerCase().includes("cancel"));

  return (
    <Screen>
      <Header title="Flight status" />
      <div className="px-4">
        {booking ? (
          <div className="mb-3">
            <StatusChip status={booking.status} />
            <p className="mt-2 text-[13px] text-[#9ca3af]">{booking.ref}</p>
          </div>
        ) : null}
        <article className="card overflow-hidden">
          <img src={wx.image} alt="" className="h-36 w-full object-cover" />
          <div className="grid grid-cols-2 gap-3 p-4 text-[14px]">
            <p>Temp<br /><span className="font-display text-[22px] text-lime">{wx.temp}</span></p>
            <p>Wind<br /><span className="font-display text-[22px]">{wx.wind}</span></p>
            <p>Visibility<br /><span className="text-white">{wx.vis}</span></p>
            <p>Clouds<br /><span className="text-white">{wx.clouds}</span></p>
          </div>
          <p className="px-4 pb-4 text-[14px] leading-5">
            <span className="text-lime">{wx.fit}.</span> {wx.tone}
          </p>
        </article>
        <ol className="mt-4 space-y-3 border-l border-line pl-4 text-[14px] leading-5">
          <li>Booked and paid.</li>
          <li>Weather check 24 hours before. We'll message you if the picture changes.</li>
          <li>Final confirmation the morning of the flight.</li>
          <li>If we delay or cancel, you are not charged.</li>
        </ol>
        <div className="mt-4">
          <PolicyNote>{WEATHER_POLICY} If you are unable to fly due to weather or mechanical issues, you will not be charged.</PolicyNote>
        </div>
        <div className="mt-4 space-y-2">
          <Button
            onClick={() => {
              if (!booking) return;
              app.setIntent({ type: "reschedule", bookingId: booking.id });
              go(`/bookings/${booking.id}`);
            }}
            disabled={!booking}
          >
            Request reschedule
          </Button>
          <Button variant="outline" onClick={() => go("/contact")}>
            Contact us
          </Button>
        </div>
        <section className="mt-5">
          <h2 className="font-display text-[18px] uppercase">Recent alerts</h2>
          {notes.length === 0 ? <p className="mt-2 text-[13px] text-[#9ca3af]">No weather alerts yet.</p> : null}
          {notes.map((n) => (
            <article key={n.id} className="card mt-2 p-3">
              <p className="text-[14px] font-semibold">{n.title}</p>
              <p className="text-[13px] leading-5 text-[#9ca3af]">{n.body}</p>
            </article>
          ))}
        </section>
      </div>
    </Screen>
  );
}
