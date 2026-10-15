import { useState } from "react";
import { Button, GuestWall, Header, Screen, TextField } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { emailOk, phoneOk } from "@/lib/format";
import { useApp } from "@/store/app-store";

export function PersonalInfoScreen() {
  const app = useApp();
  const user = app.user;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [emergencyName, setEmergencyName] = useState(user?.emergencyName || "");
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyPhone || "");
  const [feet, setFeet] = useState(user?.heightIn ? String(Math.floor(user.heightIn / 12)) : "");
  const [inches, setInches] = useState(user?.heightIn ? String(user.heightIn % 12) : "");
  const [weight, setWeight] = useState(user?.weight ? String(user.weight) : "");
  const [trunk, setTrunk] = useState(user?.trunk ? String(user.trunk) : "");
  if (!app.hydrated) return <SkeletonPage />;
  if (!user) return <GuestWall title="Personal information" body="Sign in to save details for faster booking." />;
  const valid = name.trim().length > 1 && emailOk(email) && phoneOk(phone);
  return (
    <Screen>
      <Header title="Personal information" />
      <form
        className="ios-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          app.updateUser({
            name: name.trim(),
            email: email.trim(),
            phone,
            address,
            emergencyName,
            emergencyPhone,
            heightIn: (Number(feet) || 0) * 12 + (Number(inches) || 0),
            weight: Number(weight) || 0,
            trunk: Number(trunk) || 0,
          });
          app.pushToast("Profile saved");
        }}
      >
        <TextField label="Full name" value={name} onChange={setName} />
        <TextField label="Email" type="email" value={email} onChange={setEmail} />
        <TextField label="Phone" type="tel" value={phone} onChange={setPhone} />
        <TextField label="Address" value={address} onChange={setAddress} />
        <TextField label="Emergency contact" value={emergencyName} onChange={setEmergencyName} />
        <TextField label="Emergency phone" type="tel" value={emergencyPhone} onChange={setEmergencyPhone} />
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Height feet" inputMode="numeric" value={feet} onChange={setFeet} />
          <TextField label="Inches" inputMode="numeric" value={inches} onChange={setInches} />
        </div>
        <TextField label="Weight (lbs)" inputMode="decimal" value={weight} onChange={setWeight} />
        <TextField label="Trunk circumference (in)" inputMode="decimal" value={trunk} onChange={setTrunk} hint="Saved so the next booking is faster." />
        <Button type="submit" disabled={!valid}>Save</Button>
      </form>
    </Screen>
  );
}
