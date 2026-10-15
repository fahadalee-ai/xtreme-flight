import { useMemo } from "react";

export function QrCode({ value }: { value: string }) {
  const cells = useMemo(() => {
    const bits: boolean[] = [];
    let h = 2166136261;
    for (let i = 0; i < 21 * 21; i++) {
      h ^= value.charCodeAt(i % value.length);
      h = Math.imul(h, 16777619);
      bits.push((h >>> 0) % 3 !== 0);
    }
    const paint = (x: number, y: number) => {
      bits[y * 21 + x] = true;
    };
    const finder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const edge = x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
          bits[(oy + y) * 21 + (ox + x)] = edge;
        }
      }
    };
    finder(0, 0);
    finder(14, 0);
    finder(0, 14);
    paint(10, 10);
    return bits;
  }, [value]);

  return (
    <div className="mx-auto grid w-40 grid-cols-[repeat(21,minmax(0,1fr))] gap-px rounded-xl bg-white p-2" aria-hidden>
      {cells.map((on, i) => (
        <span key={i} className={on ? "aspect-square bg-[#111827]" : "aspect-square bg-white"} />
      ))}
    </div>
  );
}
