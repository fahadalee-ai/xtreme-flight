import { useState } from "react";
import { Eye, EyeOff, Plane } from "lucide-react";
import { Button, CheckField, Header, Screen, TextField } from "@/components/chrome";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/data/seed";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";

export function LoginScreen() {
  const go = useGo();
  const app = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = () => {
    const res = app.login(email, password, remember);
    const dest = app.redirect;
    app.setRedirect(null);
    if (!res.user.notifSeen) go("/notify");
    else go(dest || "/home");
  };

  return (
    <Screen>
      <Header title="Log In" back="/onboarding" />
      <form
        className="flex flex-col gap-5 px-4 pb-8 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-lime text-ink">
            <Plane size={22} />
          </div>
          <h2 className="text-[28px] font-bold leading-[34px] tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-[15px] leading-[22px] text-[#d1d5db]">Sign in to book a flight, watch your video, and manage gift certificates.</p>
        </div>

        <div className="flex flex-col gap-4">
          <TextField label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          <label className="ios-field">
            <span className="ios-field-label">Password</span>
            <span className="relative block">
              <input
                className="field field-pad-icon"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#d1d5db]" onClick={() => setShow((s) => !s)}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <CheckField checked={remember} onChange={setRemember}>
            Remember me
          </CheckField>
          <button type="button" className="min-h-11 shrink-0 text-[15px] font-semibold text-lime" onClick={() => go("/forgot")}>
            Forgot?
          </button>
        </div>

        <Button type="submit">Log In</Button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/15" />
          <span className="text-[13px] text-[#d1d5db]">or continue with</span>
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => finishSocial("Apple")}>
            Apple
          </Button>
          <Button variant="outline" onClick={() => finishSocial("Google")}>
            Google
          </Button>
        </div>

        <p className="text-center text-[15px] leading-[22px] text-[#d1d5db]">
          New here?{" "}
          <button type="button" className="font-semibold text-lime" onClick={() => go("/register")}>
            Create an account
          </button>
        </p>

        <p className="rounded-[12px] bg-[#1f2937] px-4 py-3 text-center text-[13px] leading-5 text-[#d1d5db]">
          Demo account
          <span className="mt-1 block font-medium text-white">
            {DEMO_EMAIL}
            <br />
            {DEMO_PASSWORD}
          </span>
        </p>
      </form>
    </Screen>
  );

  function finishSocial(provider: "Apple" | "Google") {
    const user = app.social(provider);
    const dest = app.redirect;
    app.setRedirect(null);
    if (!user.notifSeen) go("/notify");
    else go(dest || "/home");
  }
}
