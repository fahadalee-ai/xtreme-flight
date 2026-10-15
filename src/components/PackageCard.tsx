import { StatusChip } from "./StatusChip";
import { money } from "@/lib/format";
import type { Package } from "@/data/types";
import { images } from "@/img/images";

const art: Record<string, string> = {
  xtreme: images.xa42Flight,
  video: images.cockpitInterior,
  youfly: images.xa42Hangar,
};

export function PackageCard({
  pkg,
  onClick,
  compact = false,
}: {
  pkg: Package;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press card overflow-hidden text-left ${compact ? "w-[78%] shrink-0 snap-center" : "w-full"}`}
    >
      <div className={`relative ${compact ? "h-36" : "h-40"}`}>
        <img src={art[pkg.id]} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
        {pkg.badge ? (
          <span className="absolute left-3 top-3">
            <StatusChip status={pkg.badge} />
          </span>
        ) : null}
      </div>
      <div className="space-y-1 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[18px] uppercase leading-6">{pkg.name}</h3>
          <span className="font-display text-[20px] leading-6 text-lime">{money(pkg.price)}</span>
        </div>
        <p className="text-[12px] leading-4 text-[#9ca3af]">{pkg.minutes}</p>
        {!compact ? <p className="text-[14px] leading-5 text-[#d1d5db]">{pkg.blurb}</p> : null}
      </div>
    </button>
  );
}
