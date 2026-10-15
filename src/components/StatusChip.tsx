import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/data/types";

const tone: Record<string, string> = {
  Confirmed: "bg-lime/15 text-lime",
  Pending: "bg-info/15 text-info",
  "Weather Watch": "bg-warn/20 text-warn",
  Delayed: "bg-warn/20 text-warn",
  "Rescheduling Needed": "bg-warn/20 text-warn",
  Rescheduled: "bg-info/15 text-info",
  Completed: "bg-info/15 text-info",
  Cancelled: "bg-danger/15 text-danger",
  "Cancelled by Operator": "bg-danger/15 text-danger",
  Processing: "bg-warn/20 text-warn",
  Ready: "bg-lime/15 text-lime",
  Purchased: "bg-info/15 text-info",
  Locked: "bg-white/10 text-[#9ca3af]",
  Active: "bg-lime/15 text-lime",
  Redeemed: "bg-info/15 text-info",
  Expired: "bg-danger/15 text-danger",
  "Most Popular": "bg-lime text-ink",
  Ultimate: "bg-white text-ink",
  Eligible: "bg-lime/15 text-lime",
  "Needs review": "bg-warn/20 text-warn",
  "Not eligible": "bg-danger/15 text-danger",
};

export function StatusChip({ status }: { status: BookingStatus | string }) {
  return (
    <span className={cn("inline-flex min-h-[22px] items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", tone[status] || "bg-secondary text-foreground")}>
      {status}
    </span>
  );
}
