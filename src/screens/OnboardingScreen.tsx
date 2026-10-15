import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { onboardingSlides } from "@/data/content";
import { Button } from "@/components/chrome";
import { useGo } from "@/lib/nav";

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = onboardingSlides[index];
  const last = index === onboardingSlides.length - 1;
  const go = useGo();

  const finish = () => {
    go("/login");
  };

  return (
    <div className="on-media relative flex flex-1 flex-col text-white">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.image}
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/55 to-black/20" />
      {index > 0 ? (
        <button type="button" className="ios-back absolute left-2 top-[env(safe-area-inset-top)] z-10" onClick={() => setIndex((n) => n - 1)}>
          <ChevronLeft size={28} strokeWidth={2.25} />
          Back
        </button>
      ) : null}
      <button type="button" onClick={finish} className="absolute right-2 top-[env(safe-area-inset-top)] z-10 min-h-11 px-2 text-[17px] text-lime">
        Skip
      </button>
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <h1 className="font-display text-[32px] uppercase leading-9">{slide.title}</h1>
        <p className="mt-3 text-[15px] leading-[22px] text-[#e5e7eb]">{slide.body}</p>
        <div className="mt-5 flex gap-1.5" aria-label="Slide progress">
          {onboardingSlides.map((s, i) => (
            <span key={s.title} className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-lime" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
        <div className="mt-5">
          <Button
            onClick={() => {
              if (last) finish();
              else setIndex((n) => n + 1);
            }}
          >
            {last ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
