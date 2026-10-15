import { useState } from "react";
import { Eye, EyeOff, Plane } from "lucide-react";
import { Button, CheckField, Header, Screen, TextField } from "@/components/chrome";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";

export function RegisterScreen() {
  const go = useGo();
  const app = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [dob, setDob] = useState("");
  const [terms, setTerms] = useState(false);

  const submit = () => {
    app.register({ name, email, phone, password, dob });
    go("/notify");
  };

  return (
    <Screen>
      <Header title="Create Account" back="/login" />
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
          <h2 className="text-[28px] font-bold leading-[34px] tracking-tight text-white">Join Xtreme Flight</h2>
          <p className="mt-2 text-[15px] leading-[22px] text-[#d1d5db]">Create an account to book the XA-42, save passengers, and collect your flight video.</p>
        </div>

        <div className="flex flex-col gap-4">
          <TextField label="Full name" autoComplete="name" value={name} onChange={setName} placeholder="Alex Morgan" />
          <TextField label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={setPhone} placeholder="(601) 555-0148" />
          <label className="ios-field">
            <span className="ios-field-label">Password</span>
            <span className="relative block">
              <input
                className="field field-pad-icon"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#d1d5db]" onClick={() => setShow((s) => !s)}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          <TextField label="Confirm password" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={setConfirm} placeholder="Repeat your password" />
          <TextField label="Date of birth" type="date" value={dob} onChange={setDob} hint="Accounts are for adults 18+. Minors fly with a parent or guardian." />
        </div>

        <CheckField checked={terms} onChange={setTerms}>
          I agree to the Terms and Privacy Policy.
        </CheckField>
        <button type="button" className="min-h-11 self-start text-[15px] font-semibold text-lime" onClick={() => go("/profile/terms")}>
          Read terms and privacy
        </button>

        <Button type="submit">Create Account</Button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/15" />
          <span className="text-[13px] text-[#d1d5db]">or continue with</span>
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => app.social("Apple") && go("/notify")}>
            Apple
          </Button>
          <Button variant="outline" onClick={() => app.social("Google") && go("/notify")}>
            Google
          </Button>
        </div>

        <p className="text-center text-[15px] leading-[22px] text-[#d1d5db]">
          Already flying with us?{" "}
          <button type="button" className="font-semibold text-lime" onClick={() => go("/login")}>
            Log in
          </button>
        </p>
      </form>
    </Screen>
  );
}
