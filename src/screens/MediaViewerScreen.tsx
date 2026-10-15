import { useState } from "react";
import { Heart } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { BottomSheet } from "@/components/BottomSheet";
import { Button, Header, Screen } from "@/components/chrome";
import { PhotoViewer } from "@/components/Gallery";
import { ShareSheet } from "@/components/ShareSheet";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useApp, useMine } from "@/store/app-store";

export function MediaViewerScreen() {
  const { mediaId } = useParams({ from: "/media/$mediaId" });
  const app = useApp();
  const mine = useMine();
  const item = mine.media.find((m) => m.id === mediaId);
  const photos = mine.media.filter((m) => m.kind === "photo");
  const index = Math.max(0, photos.findIndex((p) => p.id === mediaId));
  const [share, setShare] = useState(false);
  const [download, setDownload] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!item) {
    return (
      <Screen>
        <Header title="Media" />
        <p className="px-4 text-[#9ca3af]">That file isn't available.</p>
      </Screen>
    );
  }

  const startDownload = () => {
    setDownload(true);
    setProgress(0);
    let n = 0;
    const timer = window.setInterval(() => {
      n += 12;
      setProgress(Math.min(100, n));
      if (n >= 100) {
        window.clearInterval(timer);
        app.pushToast("Saved to this device");
      }
    }, 180);
  };

  return (
    <Screen>
      <Header
        title={item.title}
        right={
          <button type="button" aria-label="Favorite" className="press flex h-11 w-11 items-center justify-center" onClick={() => app.toggleFavorite(item.id)}>
            <Heart size={18} className={item.favorite ? "fill-lime text-lime" : ""} />
          </button>
        }
      />
      <div className="px-4">
        {item.kind === "video" ? <VideoPlayer src={item.src} poster={item.poster} /> : (
          <PhotoViewer
            photos={photos.map((p) => ({ src: p.src, alt: p.title }))}
            index={index}
            onIndex={(n) => {
              const next = photos[n];
              if (next) window.history.replaceState(null, "", `${import.meta.env.BASE_URL}media/${next.id}`.replace(/\/{2,}/g, "/"));
            }}
          />
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={startDownload}>Download</Button>
          <Button variant="outline" onClick={() => setShare(true)}>
            Share
          </Button>
        </div>
      </div>
      <ShareSheet open={share} onClose={() => setShare(false)} url="https://xtreme-flight.com/" />
      <BottomSheet open={download} onClose={() => setDownload(false)} title="Download">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-lime" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-[14px]">{progress >= 100 ? "Saved on this device." : `Saving… ${progress}%`}</p>
      </BottomSheet>
    </Screen>
  );
}
