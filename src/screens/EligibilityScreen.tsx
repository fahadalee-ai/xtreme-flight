import { useMemo, useState } from "react";
import { Button, CheckField, Header, Screen, TextField } from "@/components/chrome";
import { StatusChip } from "@/components/StatusChip";
import { checkEligibility } from "@/lib/eligibility";

export function EligibilityScreen() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [trunk, setTrunk] = useState("");
  const [pregnant, setPregnant] = useState(false);
  const [canBoard, setCanBoard] = useState(true);
  const [backNeck, setBackNeck] = useState(false);
  const [ready, setReady] = useState(false);

  const heightIn = (Number(feet) || 0) * 12 + (Number(inches) || 0);
  const result = useMemo(() => {
    if (!ready) return null;
    return checkEligibility({
      age: Number(age) || 0,
      weight: Number(weight) || 0,
      heightIn,
      trunk: Number(trunk) || 0,
      pregnant,
      canBoard,
      backNeck,
    });
  }, [ready, age, weight, heightIn, trunk, pregnant, canBoard, backNeck]);

  const label = result?.status === "eligible" ? "Eligible" : result?.status === "review" ? "Needs review" : "Not eligible";

  return (
    <Screen>
      <Header title="Eligibility" />
      <form
        className="ios-stack"
        onSubmit={(e) => {
          e.preventDefault();
          setReady(true);
        }}
      >
        <p className="text-[14px] leading-5 text-[#9ca3af]">Instant check against the published limits. This is not a medical clearance.</p>
        <TextField label="Age" inputMode="numeric" value={age} onChange={setAge} />
        <TextField label="Weight (lbs)" inputMode="decimal" value={weight} onChange={setWeight} />
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Height (feet)" inputMode="numeric" value={feet} onChange={setFeet} />
          <TextField label="Height (inches)" inputMode="numeric" value={inches} onChange={setInches} />
        </div>
        <TextField label="Trunk circumference (inches)" inputMode="decimal" value={trunk} onChange={setTrunk} hint="Largest circumference from below the chest to the waist." />
        <CheckField checked={pregnant} onChange={setPregnant}>
          Pregnant
        </CheckField>
        <CheckField checked={canBoard} onChange={setCanBoard}>
          Able to get in and out of the aircraft and wear the harness
        </CheckField>
        <CheckField checked={backNeck} onChange={setBackNeck}>
          Back or neck injury to discuss with a physician
        </CheckField>
        <Button type="submit" disabled={!age || !weight || !feet || !trunk}>
          Check eligibility
        </Button>
      </form>
      {result ? (
        <div className="mx-4 mt-4 card p-4">
          <StatusChip status={label} />
          <ul className="mt-3 space-y-2 text-[14px] leading-5">
            {result.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
            {result.notes.map((r) => (
              <li key={r} className="text-[#d9f99d]">
                {r}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Screen>
  );
}
