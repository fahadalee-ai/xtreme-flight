import { images } from "@/img/images";
import { KIDS_VIDEO, stories } from "@/data/content";
import { Header, Screen } from "@/components/chrome";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useGo } from "@/lib/nav";

const points = [
  "Ages 7 and up. Younger passengers are considered case by case.",
  "Custom-fitted parachute and harness. Under 5 feet uses the special parachute add-on.",
  "Constant headset communication with the instructor.",
  "Your child controls the intensity. We start gentle and stop when they say stop.",
  "A parent or guardian must be present at the briefing.",
];

export function KidsScreen() {
  const story = stories[0];
  const go = useGo();
  return (
    <Screen>
      <Header title="Kids" />
      <img src={images.kidInverted} alt="Child inverted during an aerobatic flight" className="mx-4 h-56 w-[calc(100%-2rem)] rounded-[18px] object-cover" />
      <div className="mt-4 px-4">
        <h2 className="font-display text-[28px] uppercase leading-8">A first flight they'll never forget</h2>
        <p className="mt-2 text-[15px] leading-[22px] text-[#d1d5db]">Real aerobatic flight for ages 7 and up, paced by the passenger in the front seat.</p>
      </div>
      <ul className="mt-4 space-y-2 px-4">
        {points.map((p) => (
          <li key={p} className="card px-3 py-3 text-[14px] leading-5">
            {p}
          </li>
        ))}
      </ul>
      <article className="card mx-4 mt-4 p-4">
        <p className="text-lime">★★★★★</p>
        <p className="mt-2 text-[15px] leading-[22px]">“{story.text}”</p>
        <p className="mt-2 text-[12px] text-[#9ca3af]">
          {story.name}, {story.role}, {story.location}
        </p>
      </article>
      <div className="mt-4 px-4">
        <VideoPlayer src={KIDS_VIDEO} poster={images.kidInverted} />
        <button type="button" className="mt-4 text-[14px] text-lime" onClick={() => go("/eligibility")}>
          Check eligibility
        </button>
      </div>
    </Screen>
  );
}
