import { useState } from "react";
import { Header, Screen, Segmented } from "@/components/chrome";
import { wearRules } from "@/data/content";

export function PrepScreen() {
  const [tab, setTab] = useState("wear");
  return (
    <Screen>
      <Header title="Prepare" />
      <div className="px-4">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: "wear", label: "Wear" },
            { id: "wellness", label: "Wellness" },
            { id: "camera", label: "Cameras" },
          ]}
        />
      </div>
      <div className="mt-4 space-y-3 px-4 text-[15px] leading-[22px] text-[#d1d5db]">
        {tab === "wear" && (
          <ul className="space-y-2">
            {wearRules.map((rule) => (
              <li key={rule} className="card px-3 py-3">
                {rule}
              </li>
            ))}
          </ul>
        )}
        {tab === "wellness" && (
          <article className="card p-4">
            <h2 className="font-display text-[20px] uppercase text-white">Motion sickness</h2>
            <p className="mt-2">
              It may happen, whether you fly for a living or this is your first flight. We can't predict who will feel it. If you start to feel sick, your instructor can land in about a minute and a half.
            </p>
            <p className="mt-3 text-[13px] leading-5 text-[#9ca3af]">
              While this is not medical advice, our experience has shown best results with Meclizine. Talk with your physician before taking any medication.
            </p>
          </article>
        )}
        {tab === "camera" && (
          <article className="card p-4">
            <h2 className="font-display text-[20px] uppercase text-white">Camera policy</h2>
            <p className="mt-2">Own cameras and GoPros are welcome on the ground. Take as many pictures as you like before and after the flight.</p>
            <p className="mt-3">No hand-held cameras during flight. Phones stay out of the cockpit. GoPros are mounted in the aircraft, and edited video is part of the video packages.</p>
          </article>
        )}
      </div>
    </Screen>
  );
}
