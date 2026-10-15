import { images } from "@/img/images";
import { Header, Screen } from "@/components/chrome";
import { socials } from "@/data/content";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/format";
import { useGo } from "@/lib/nav";

export function AboutScreen() {
  const go = useGo();
  return (
    <Screen>
      <Header title="About" />
      <div className="px-4">
        <img src={images.logo} alt="Xtreme Flight" className="logo-knockout h-16 w-auto" />
        <h2 className="mt-4 font-display text-[28px] uppercase leading-8">Fly like an Airshow Pilot</h2>
        <p className="mt-3 text-[15px] leading-[22px] text-[#d1d5db]">
          Real aerobatic flight, from mild to Xtreme, for ages 7 and up. The only XA-42 aerobatic experience in the U.S. Gentle to ±10 G flights with a Certified Flight Instructor. Built for thrill seekers, families, gift givers, and events.
        </p>
        <p className="mt-3 text-[14px] leading-5 text-[#9ca3af]">Airshow Thrills · Real Flight · Pure Adrenaline</p>
        <button type="button" className="mt-4 text-[14px] text-lime" onClick={() => go("/crew")}>
          Meet the crew
        </button>
        <p className="mt-4 text-[14px] leading-5">{ADDRESS}</p>
        <a className="mt-2 block text-lime" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
        <a className="mt-1 block text-lime" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <div className="mt-4 flex flex-wrap gap-3">
          {socials.map((s) => (
            <a key={s.id} href={s.href} target="_blank" rel="noreferrer" className="text-[13px] text-[#d1d5db]">
              {s.label} {s.handle}
            </a>
          ))}
        </div>
      </div>
    </Screen>
  );
}
