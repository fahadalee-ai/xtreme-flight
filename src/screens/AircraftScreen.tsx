import { images } from "@/img/images";
import { HERO_VIDEO, aircraftFacts, specs } from "@/data/content";
import { Header, Screen } from "@/components/chrome";
import { VideoPlayer } from "@/components/VideoPlayer";

const shots = [
  { src: images.xa42Flight, alt: "XA-42 in flight" },
  { src: images.xa42Ramp, alt: "XA-42 on the ramp" },
  { src: images.xa42Hangar, alt: "XA-42 in the hangar" },
  { src: images.xa42Maintenance, alt: "XA-42 maintenance" },
  { src: images.xa42BwWing, alt: "XA-42 wing" },
  { src: images.cockpitView, alt: "Cockpit view" },
];

export function AircraftScreen() {
  return (
    <Screen>
      <Header title="The XA-42" />
      <div className="flex snap-x gap-2 overflow-x-auto px-4 no-scrollbar">
        {shots.map((s) => (
          <img key={s.src} src={s.src} alt={s.alt} className="h-48 w-[80%] shrink-0 snap-center rounded-[18px] object-cover" />
        ))}
      </div>
      <div className="mt-4 px-4">
        <p className="text-[12px] uppercase tracking-[0.16em] text-lime">Unlimited aerobatics</p>
        <h2 className="font-display text-[28px] uppercase leading-8">Fastest-rolling XA-42 in the world</h2>
        <p className="mt-2 text-[15px] leading-[22px] text-[#d1d5db]">
          The XA-42 is a fully composite, unlimited aerobatic aircraft capable of +10 / -10 Gs. FAA and EASA certified. This is the only XA-42 aerobatic experience in the U.S.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 px-4">
        {specs.map((s) => (
          <article key={s.label} className="card p-3">
            <p className="font-display text-[26px] leading-7 text-lime">
              {s.value}
              <span className="ml-1 text-[14px] text-white">{s.unit}</span>
            </p>
            <p className="text-[12px] text-[#9ca3af]">{s.label}</p>
          </article>
        ))}
      </div>
      <ul className="mt-4 space-y-2 px-4 text-[14px] leading-5">
        {aircraftFacts.map((fact) => (
          <li key={fact} className="card px-3 py-3">
            {fact}
          </li>
        ))}
      </ul>
      <div className="mt-5 px-4">
        <h3 className="mb-2 font-display text-[18px] uppercase">Real flight footage</h3>
        <VideoPlayer src={HERO_VIDEO} poster={images.xa42Flight} />
      </div>
    </Screen>
  );
}
