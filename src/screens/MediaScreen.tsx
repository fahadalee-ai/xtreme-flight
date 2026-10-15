import { useState } from "react";
import { images } from "@/img/images";
import { Button, GuestWall, LargeTitle, Screen, Segmented } from "@/components/chrome";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonPage } from "@/components/Skeleton";
import { Gallery } from "@/components/Gallery";
import { StatusChip } from "@/components/StatusChip";
import { useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";

export function MediaScreen() {
  const [tab, setTab] = useState("videos");
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) {
    return <GuestWall title="Media" body="Flight videos and photos are tied to your bookings. Sign in to watch, download, and share." />;
  }
  const videos = mine.media.filter((m) => m.kind === "video");
  const photos = mine.media.filter((m) => m.kind === "photo");

  return (
    <Screen tab>
      <LargeTitle title="Media" />
      <div className="px-4">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: "videos", label: "Videos" },
            { id: "photos", label: "Photos" },
          ]}
        />
      </div>
      {tab === "videos" && (
        <div className="mt-4 space-y-3 px-4">
          {videos.length === 0 ? (
            <EmptyState image={images.emptyMedia} title="No media yet" body="Your edited flight video arrives within 1–7 business days." />
          ) : (
            videos.map((video) => (
              <article key={video.id} className="card overflow-hidden">
                <button type="button" className="relative block w-full text-left" onClick={() => video.status !== "Locked" && video.status !== "Processing" && go(`/media/${video.id}`)}>
                  <img src={video.poster || images.xa42Flight} alt="" className={`h-40 w-full object-cover ${video.status === "Locked" ? "blur-sm" : ""}`} />
                  <span className="absolute left-3 top-3">
                    <StatusChip status={video.status} />
                  </span>
                  {video.duration ? <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-[12px]">{video.duration}</span> : null}
                </button>
                <div className="p-3">
                  <p className="font-display text-[18px] uppercase">{video.title}</p>
                  {video.status === "Processing" ? <p className="mt-1 text-[13px] text-[#9ca3af]">Delivered within 1–7 business days after the flight.</p> : null}
                  {video.status === "Locked" ? (
                    <Button className="mt-3" onClick={() => app.unlockVideo(video.id)}>
                      Add video to this flight · $180
                    </Button>
                  ) : null}
                  {video.status === "Ready" || video.status === "Purchased" ? (
                    <Button className="mt-3" variant="outline" onClick={() => go(`/media/${video.id}`)}>
                      Watch
                    </Button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      )}
      {tab === "photos" && (
        <div className="mt-4">
          {photos.length === 0 ? (
            <EmptyState image={images.emptyMedia} title="No photos yet" body="Ramp and flight photos show up here after your day." />
          ) : (
            <Gallery photos={photos.map((p) => ({ src: p.src, alt: p.title, id: p.id }))} onOpen={(i) => go(`/media/${photos[i].id}`)} />
          )}
        </div>
      )}
    </Screen>
  );
}
