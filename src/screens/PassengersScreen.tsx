import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { Button, GuestWall, Header, Screen, TextField } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { heightLabel, uid } from "@/lib/format";
import { useApp } from "@/store/app-store";

export function PassengersScreen() {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) return <GuestWall title="Passengers" body="Sign in to save passengers for the next booking." />;
  return (
    <Screen>
      <Header title="Saved passengers" />
      <div className="ios-stack">
        {app.passengers.map((p) => (
          <article key={p.id} className="card p-4">
            <p className="font-display text-[18px] uppercase">{p.name}</p>
            <p className="text-[13px] text-[#9ca3af]">
              Age {p.age} · {heightLabel(p.heightIn)} · {p.weight} lbs
              {p.isMinor ? " · Minor" : ""}
            </p>
            <button type="button" className="mt-2 text-[13px] text-danger" onClick={() => app.removePassenger(p.id)}>
              Remove
            </button>
          </article>
        ))}
        {app.passengers.length === 0 ? <p className="text-[14px] text-[#9ca3af]">No saved passengers yet.</p> : null}
        <Button onClick={() => setOpen(true)}>Add passenger</Button>
      </div>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Add passenger">
        <div className="space-y-3">
          <TextField label="Name" value={name} onChange={setName} />
          <TextField label="Age" inputMode="numeric" value={age} onChange={setAge} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Feet" inputMode="numeric" value={feet} onChange={setFeet} />
            <TextField label="Inches" inputMode="numeric" value={inches} onChange={setInches} />
          </div>
          <TextField label="Weight" inputMode="decimal" value={weight} onChange={setWeight} />
          <Button
            disabled={name.trim().length < 2 || !age}
            onClick={() => {
              const ageN = Number(age) || 0;
              app.savePassenger({
                id: uid("sp"),
                name: name.trim(),
                age: ageN,
                heightIn: (Number(feet) || 0) * 12 + (Number(inches) || 0),
                weight: Number(weight) || 0,
                trunk: 0,
                email: app.user?.email || "",
                phone: app.user?.phone || "",
                emergencyName: app.user?.emergencyName || "",
                emergencyPhone: app.user?.emergencyPhone || "",
                requests: "",
                isMinor: ageN < 18,
                guardianName: ageN < 18 ? app.user?.name : undefined,
                guardianPhone: ageN < 18 ? app.user?.phone : undefined,
              });
              setOpen(false);
              setName("");
              setAge("");
            }}
          >
            Save
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
