import { useState } from "react";

export function Gallery({
  photos,
  onOpen,
}: {
  photos: { src: string; alt: string; id?: string }[];
  onOpen?: (index: number) => void;
}) {
  return (
    <div className="columns-2 gap-2 px-4">
      {photos.map((photo, i) => (
        <button key={photo.id || photo.src + i} type="button" className="mb-2 block w-full overflow-hidden rounded-[16px]" onClick={() => onOpen?.(i)}>
          <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full object-cover" />
        </button>
      ))}
    </div>
  );
}

export function PhotoViewer({
  photos,
  index,
  onIndex,
}: {
  photos: { src: string; alt: string }[];
  index: number;
  onIndex: (n: number) => void;
}) {
  const [scale, setScale] = useState(1);
  const photo = photos[index];
  if (!photo) return null;
  return (
    <div className="relative">
      <img
        src={photo.src}
        alt={photo.alt}
        style={{ transform: `scale(${scale})` }}
        className="max-h-[60vh] w-full origin-center rounded-[18px] object-contain transition-transform"
        onDoubleClick={() => setScale((s) => (s > 1 ? 1 : 2))}
        onWheel={(e) => {
          e.preventDefault();
          setScale((s) => Math.min(3, Math.max(1, s + (e.deltaY < 0 ? 0.15 : -0.15))));
        }}
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" className="btn btn-outline !w-auto px-4" onClick={() => onIndex(Math.max(0, index - 1))} disabled={index === 0}>
          Prev
        </button>
        <div className="flex gap-2">
          <button type="button" className="press h-11 rounded-full border border-line px-3" onClick={() => setScale((s) => Math.max(1, s - 0.25))}>
            −
          </button>
          <button type="button" className="press h-11 rounded-full border border-line px-3" onClick={() => setScale((s) => Math.min(3, s + 0.25))}>
            +
          </button>
        </div>
        <button
          type="button"
          className="btn btn-outline !w-auto px-4"
          onClick={() => onIndex(Math.min(photos.length - 1, index + 1))}
          disabled={index === photos.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
