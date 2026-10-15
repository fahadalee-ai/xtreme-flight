import { Header, Screen } from "@/components/chrome";
import { ADDRESS, EMAIL, MAPS_QUERY, PHONE_DISPLAY, PHONE_TEL, mapsLinks } from "@/lib/format";
import { useApp } from "@/store/app-store";

export function LocationScreen() {
  const { pushToast } = useApp();
  const maps = mapsLinks();
  const q = encodeURIComponent(MAPS_QUERY);
  return (
    <Screen>
      <Header title="Wings Field" />
      <div className="px-4">
        <iframe
          title="Map of Wings Field"
          className="h-56 w-full rounded-[18px] border border-line"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-89.22%2C35.28%2C-89.08%2C35.36&layer=mapnik&marker=35.323%2C-89.146`}
        />
        <h2 className="mt-4 font-display text-[24px] uppercase leading-7">Wings Field (2TN2)</h2>
        <p className="mt-1 text-[15px] leading-[22px]">{ADDRESS}</p>
        <p className="text-[13px] text-lime">Near Memphis, TN</p>
        <p className="mt-2 text-[13px] leading-5 text-[#9ca3af]">Enthusiasts fly in from all over. Plan about 4 hours on site and arrive with time to brief.</p>
        <article className="card mt-4 p-4 text-[14px] leading-5">
          <p className="font-display text-[16px] uppercase">Arrival</p>
          <p className="mt-2 text-[#d1d5db]">Check in at the hangar on Farris Road. Parking is on site. Bring a government ID. If you're running behind, call before you leave the highway.</p>
          <p className="mt-2 text-[#9ca3af]">ETA placeholder: about 45 minutes from downtown Memphis, traffic depending.</p>
        </article>
        <div className="mt-4 space-y-2">
          <a className="btn btn-primary" href={maps.google} target="_blank" rel="noreferrer">Open in Google Maps</a>
          <a className="btn btn-outline" href={maps.apple} target="_blank" rel="noreferrer">Open in Apple Maps</a>
          <a className="btn btn-outline" href={`tel:${PHONE_TEL}`}>Call {PHONE_DISPLAY}</a>
          <a className="btn btn-outline" href={`mailto:${EMAIL}`}>Email</a>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const text = `${ADDRESS} https://www.google.com/maps/search/?api=1&query=${q}`;
              if (navigator.share) void navigator.share({ title: "Wings Field", text });
              else void navigator.clipboard.writeText(text).then(() => pushToast("Location copied"));
            }}
          >
            Share location
          </button>
        </div>
      </div>
    </Screen>
  );
}
