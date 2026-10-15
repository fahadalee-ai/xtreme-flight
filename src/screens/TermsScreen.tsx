import { Header, Screen } from "@/components/chrome";
import { CANCEL_POLICY, PRICE_PROMISE, RISK_COPY, WEATHER_POLICY } from "@/lib/format";

export function TermsScreen() {
  return (
    <Screen>
      <Header title="Terms and privacy" />
      <div className="space-y-4 px-4 text-[15px] leading-[22px] text-[#d1d5db]">
        <section>
          <h2 className="font-display text-[18px] uppercase text-white">Risk</h2>
          <p className="mt-2">{RISK_COPY} We cannot guarantee your safety.</p>
        </section>
        <section>
          <h2 className="font-display text-[18px] uppercase text-white">Price</h2>
          <p className="mt-2">{PRICE_PROMISE}</p>
        </section>
        <section>
          <h2 className="font-display text-[18px] uppercase text-white">Cancellation</h2>
          <p className="mt-2">{CANCEL_POLICY}</p>
        </section>
        <section>
          <h2 className="font-display text-[18px] uppercase text-white">Weather and mechanical</h2>
          <p className="mt-2">{WEATHER_POLICY}</p>
        </section>
        <section>
          <h2 className="font-display text-[18px] uppercase text-white">Privacy</h2>
          <p className="mt-2">
            This preview stores your profile, bookings, and certificates on this device only. It does not send them to a server. Payment fields are a mock and are not charged. Photos you attach stay in the browser.
          </p>
        </section>
        <section>
          <h2 className="font-display text-[18px] uppercase text-white">Accounts</h2>
          <p className="mt-2">You must be 18 or older to create an account. Minors fly with a parent or guardian present at the briefing.</p>
        </section>
      </div>
    </Screen>
  );
}
