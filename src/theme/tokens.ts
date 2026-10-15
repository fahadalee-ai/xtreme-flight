/** Xtreme Flight color and type tokens. Supporting tones are derived from lime + ink. */
export const tokens = {
  lime: "#a3e635",
  limePressed: "#84cc16",
  limeTint: "rgba(163,230,53,0.12)",
  ink: "#111827",
  surface: "#1f2937",
  elevated: "#273244",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "#9ca3af",
  success: "#a3e635",
  warning: "#facc15",
  danger: "#f87171",
  info: "#60a5fa",
} as const;

export const type = {
  h1: "font-display text-[32px] uppercase leading-9 tracking-wide",
  h2: "font-display text-[24px] uppercase leading-7 tracking-wide",
  h3: "font-display text-[18px] uppercase leading-6 tracking-wide",
  body: "text-[15px] leading-[22px]",
  caption: "text-[12px] leading-4",
} as const;
