import { useEffect, useState } from "react";
import { Button, Header, Screen, TextField } from "@/components/chrome";
import { emailOk } from "@/lib/format";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";

export function ForgotPasswordScreen() {
  const app = useApp();
  const go = useGo();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  const send = () => {
    setError("");
    if (!emailOk(email)) {
      setError("Enter a valid email.");
      return;
    }
    if (!app.emailExists(email)) {
      setError("We couldn't find an account with that email.");
      return;
    }
    const next = String(Math.floor(100000 + Math.random() * 900000));
    setSent(next);
    setSeconds(30);
    setStep(1);
    app.pushToast("Code sent", `Preview code ${next}`);
  };

  return (
    <Screen>
      <Header title="Reset Password" back="/login" />
      <div className="ios-stack">
        {step === 0 && (
          <>
            <p className="text-[15px] leading-[22px] text-[#9ca3af]">We'll email a 6-digit code to reset your password.</p>
            <TextField label="Email" type="email" inputMode="email" value={email} onChange={setEmail} error={error} />
            <Button onClick={send} disabled={!emailOk(email)}>
              Send code
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <p className="text-[15px] leading-[22px] text-[#9ca3af]">
              Enter the code sent to {email}. Preview code: <span className="text-lime">{sent}</span>
            </p>
            <TextField label="6-digit code" inputMode="numeric" value={code} onChange={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))} error={error} />
            <Button
              disabled={code.length !== 6}
              onClick={() => {
                if (code !== sent) {
                  setError("That code doesn't match.");
                  return;
                }
                setError("");
                setStep(2);
              }}
            >
              Verify
            </Button>
            <button
              type="button"
              disabled={seconds > 0}
              className="min-h-11 text-[14px] text-lime disabled:text-[#9ca3af]"
              onClick={send}
            >
              {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <TextField label="New password" type="password" value={password} onChange={setPassword} error={password && password.length < 8 ? "Use at least 8 characters." : ""} />
            <TextField label="Confirm password" type="password" value={confirm} onChange={setConfirm} error={confirm && confirm !== password ? "Passwords do not match." : ""} />
            <Button
              disabled={password.length < 8 || password !== confirm}
              onClick={() => {
                const res = app.resetPassword(email, password);
                if (!res.ok) {
                  setError(res.reason);
                  return;
                }
                app.pushToast("Password updated");
                setStep(3);
              }}
            >
              Save password
            </Button>
          </>
        )}
        {step === 3 && (
          <div className="card p-5 text-center">
            <div className="check-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-3xl text-ink">✓</div>
            <h2 className="mt-4 font-display text-[24px] uppercase">You're set</h2>
            <p className="mt-2 text-[14px] leading-5 text-[#9ca3af]">Sign in with your new password.</p>
            <Button className="mt-4" onClick={() => go("/login")}>
              Back to log in
            </Button>
          </div>
        )}
      </div>
    </Screen>
  );
}
