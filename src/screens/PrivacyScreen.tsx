import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { Button, CheckField, GuestWall, Header, Screen, Switch, TextField } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { useGo } from "@/lib/nav";
import { useApp } from "@/store/app-store";

export function PrivacyScreen() {
  const app = useApp();
  const go = useGo();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [sure, setSure] = useState(false);
  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) return <GuestWall title="Privacy" body="Sign in to manage your password and account." />;
  return (
    <Screen>
      <Header title="Privacy and security" />
      <form
        className="ios-stack"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          if (next !== confirm) {
            setError("New passwords do not match.");
            return;
          }
          const res = app.changePassword(current, next);
          if (!res.ok) setError(res.reason);
          else {
            setCurrent("");
            setNext("");
            setConfirm("");
            app.pushToast("Password changed");
          }
        }}
      >
        <TextField label="Current password" type="password" value={current} onChange={setCurrent} />
        <TextField label="New password" type="password" value={next} onChange={setNext} />
        <TextField label="Confirm new password" type="password" value={confirm} onChange={setConfirm} />
        {error ? <p className="text-[13px] text-danger">{error}</p> : null}
        <Button type="submit" disabled={current.length < 1 || next.length < 8 || next !== confirm}>
          Change password
        </Button>
        <div className="ios-group">
        <div className="ios-row">
          <span className="min-w-0 flex-1 text-[17px] leading-[22px]">Biometric login</span>
          <Switch checked={Boolean(app.user.biometric)} label="Biometric login" onChange={(v) => app.updateUser({ biometric: v })} />
        </div>
        </div>
        <p className="text-[12px] leading-4 text-[#9ca3af]">Biometric unlock is a device preference in this preview. It is not connected to Face ID or fingerprint hardware.</p>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete account
        </Button>
      </form>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Delete account">
        <p className="text-[14px] leading-5">This removes your profile and bookings from this device.</p>
        <div className="mt-3">
          <CheckField checked={sure} onChange={setSure}>
            I understand this removes my bookings from this device.
          </CheckField>
        </div>
        <Button
          variant="danger"
          className="mt-4"
          disabled={!sure}
          onClick={() => {
            setOpen(false);
            app.deleteAccount();
            go("/welcome");
          }}
        >
          Delete account
        </Button>
      </BottomSheet>
    </Screen>
  );
}
