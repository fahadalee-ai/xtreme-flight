import { useRef, useState } from "react";
import { Maximize2, Pause, Play } from "lucide-react";

export function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] bg-black">
      <video
        ref={ref}
        poster={poster}
        playsInline
        className="aspect-video w-full bg-black object-cover"
        onTimeUpdate={() => {
          const el = ref.current;
          if (!el || !el.duration) return;
          setProgress((el.currentTime / el.duration) * 100);
        }}
        onEnded={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="flex items-center gap-3 bg-surface px-3 py-2">
        <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle} className="press flex h-11 w-11 items-center justify-center text-lime">
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <input
          aria-label="Seek"
          type="range"
          min={0}
          max={100}
          value={progress}
          className="w-full accent-[#a3e635]"
          onChange={(e) => {
            const el = ref.current;
            const next = Number(e.target.value);
            setProgress(next);
            if (el && el.duration) el.currentTime = (next / 100) * el.duration;
          }}
        />
        <button
          type="button"
          aria-label="Fullscreen"
          className="press flex h-11 w-11 items-center justify-center"
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            if (el.requestFullscreen) void el.requestFullscreen();
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
