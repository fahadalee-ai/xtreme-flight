import { crew } from "@/data/content";
import { Header, Screen } from "@/components/chrome";

export function CrewScreen() {
  return (
    <Screen>
      <Header title="The Crew" />
      <p className="px-4 text-[15px] leading-[22px] text-[#d1d5db]">You fly with a certified instructor. Carla looks after the film and the welcome, in English and Spanish.</p>
      <div className="mt-4 space-y-4 px-4">
        {crew.map((person) => (
          <article key={person.id} className="card overflow-hidden">
            <img src={person.photo} alt={person.name} className="h-64 w-full object-cover object-top" />
            <div className="p-4">
              <h2 className="font-display text-[24px] uppercase">{person.name}</h2>
              <p className="text-[13px] text-lime">{person.role}</p>
              <p className="mt-2 text-[14px] leading-5 text-[#d1d5db]">{person.bio}</p>
              <ul className="mt-3 space-y-1 text-[14px]">
                {person.points.map((point) => (
                  <li key={point}>· {point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}
