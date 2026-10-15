export function Stepper({ step, total }: { step: number; total: number }) {
  const pct = Math.min(100, ((step + 1) / total) * 100);
  return (
    <div className="px-4 pb-2">
      <div className="mb-1 flex justify-between text-[12px] leading-4 text-[#9ca3af]">
        <span>
          Step {step + 1} of {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-lime transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
