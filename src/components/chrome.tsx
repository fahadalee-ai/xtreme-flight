import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { tap } from "@/lib/format";
import { images } from "@/img/images";
import { parentOf, useBack, useGo } from "@/lib/nav";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        tap();
        props.onClick?.(e);
      }}
      className={cn("btn press", `btn-${variant}`, className)}
    >
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={cn(
        "press inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Header({
  title,
  back,
  right,
}: {
  title: string;
  back?: boolean | string | (() => void);
  right?: ReactNode;
}) {
  const leave = useBack();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const index = useRouterState({ select: (s) => Number((s.location.state as { __TSR_index?: number } | undefined)?.__TSR_index ?? 0) });
  const goingHome =
    typeof back !== "function" && (typeof back === "string" ? back === "/home" : index <= 0 && parentOf(pathname) === "/home");
  const label = goingHome ? "Home" : "Back";
  return (
    <header className="ios-nav">
      <div className="ios-nav-bar">
        <div className="ios-nav-side">
          <button type="button" className="ios-back" onClick={() => leave(back)}>
            <ChevronLeft size={28} strokeWidth={2.25} />
            {label}
          </button>
        </div>
        <h1 className="ios-nav-title">{title}</h1>
        <div className="ios-nav-side ios-nav-side-right">{right}</div>
      </div>
    </header>
  );
}

export function LargeTitle({
  title,
  eyebrow,
  leading,
  right,
}: {
  title: string;
  eyebrow?: string;
  leading?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="ios-large">
      {leading}
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className="ios-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
      </div>
      {right}
    </header>
  );
}

export function Screen({ children, className, tab = false }: { children: ReactNode; className?: string; tab?: boolean }) {
  return <div className={cn("min-h-full", tab ? "pb-36" : "pb-8", className)}>{children}</div>;
}

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
}) {
  return (
    <label className="ios-field">
      <span className="ios-field-label">{label}</span>
      <input
        className={cn("field", error && "field-error")}
        value={value}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <span className="ios-hint text-danger">{error}</span> : null}
      {!error && hint ? <span className="ios-hint">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="ios-field">
      <span className="ios-field-label">{label}</span>
      <textarea className="field" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="ios-field">
      <span className="ios-field-label">{label}</span>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckField({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="ios-check-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={cn("ios-switch", checked && "ios-switch-on")} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

export function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="ios-segment" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between px-4">
      <h2 className="font-display text-[24px] uppercase leading-7 tracking-wide">{children}</h2>
      {action}
    </div>
  );
}

export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-line bg-background/95 px-4 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-md">
      {children}
    </div>
  );
}

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const eased = 1 - (1 - p) ** 3;
      setN(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <span>
      {n}
      {suffix}
    </span>
  );
}

export function RowLink({
  label,
  detail,
  icon,
  onClick,
}: {
  label: string;
  detail?: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="ios-row press w-full">
      {icon ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/8 text-lime">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] leading-[22px]">{label}</span>
        {detail ? <span className="block text-[13px] leading-[18px] text-[#d1d5db]">{detail}</span> : null}
      </span>
      <ChevronRight size={18} className="shrink-0 text-[#9ca3af]" />
    </button>
  );
}

export function GuestWall({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const go = useGo();
  return (
    <Screen>
      <Header title={title} />
      <div className="px-4 pt-6 text-center">
        <img src={images.logo} alt="Xtreme Flight" className="logo-knockout mx-auto h-16 w-auto" />
        <p className="mt-4 text-[15px] leading-[22px] text-[#9ca3af]">{body}</p>
        <div className="mt-6 space-y-3">
          <Button onClick={() => go("/login")}>Log In</Button>
          <Button variant="outline" onClick={() => go("/register")}>
            Create Account
          </Button>
        </div>
      </div>
    </Screen>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card mx-4 p-5 text-center">
      <p className="font-display text-[18px] uppercase">Couldn't load</p>
      <p className="mt-2 text-[14px] leading-5 text-[#9ca3af]">{message}</p>
      <Button className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function PolicyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-[14px] bg-lime/10 px-3 py-2 text-[12px] leading-4 text-[#d9f99d]">{children}</p>;
}
