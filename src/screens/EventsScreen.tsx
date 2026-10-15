import { useState } from "react";
import { Button, Header, Screen, SelectField, TextArea, TextField } from "@/components/chrome";
import { budgetRanges, eventTypes, packages } from "@/data/content";
import { EMAIL, PHONE_TEL, emailOk, phoneOk } from "@/lib/format";

export function EventsScreen() {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [dates, setDates] = useState("");
  const [size, setSize] = useState("");
  const [packs, setPacks] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [show, setShow] = useState(false);

  const toggle = (id: string) => setPacks((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  const valid = name.trim().length > 1 && emailOk(email) && phoneOk(phone) && type && size && message.trim().length > 4;

  if (sent) {
    return (
      <Screen>
        <Header title="Events" />
        <div className="px-4 text-center">
          <div className="check-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-3xl text-ink">✓</div>
          <h2 className="mt-4 font-display text-[24px] uppercase leading-7">We'll reply with group pricing and availability.</h2>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Groups and events" />
      <div className="ios-stack text-[17px] leading-[22px]">
        <p>Corporate events, birthdays, team outings, airshow-style flights, and kids' groups. Tell us the shape of the day and we'll come back with pricing.</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setShow(true);
            if (!valid) return;
            setSent(true);
          }}
        >
          <TextField label="Contact name" value={name} onChange={setName} error={show && name.trim().length < 2 ? "Enter a name." : ""} />
          <TextField label="Organization" value={org} onChange={setOrg} />
          <TextField label="Email" type="email" value={email} onChange={setEmail} error={show && !emailOk(email) ? "Enter a valid email." : ""} />
          <TextField label="Phone" type="tel" value={phone} onChange={setPhone} error={show && !phoneOk(phone) ? "Enter a phone number." : ""} />
          <SelectField label="Event type" value={type} onChange={setType} options={eventTypes} />
          <TextField label="Preferred date range" value={dates} onChange={setDates} placeholder="A weekend in May" />
          <TextField label="Group size" inputMode="numeric" value={size} onChange={setSize} />
          <fieldset>
            <legend className="mb-2 text-[12px] text-[#9ca3af]">Preferred packages</legend>
            <div className="flex flex-wrap gap-2">
              {packages.map((p) => (
                <button key={p.id} type="button" onClick={() => toggle(p.id)} className={`press rounded-full px-3 py-2 text-[12px] ${packs.includes(p.id) ? "bg-lime text-ink" : "border border-line"}`}>
                  {p.name}
                </button>
              ))}
            </div>
          </fieldset>
          <TextArea label="Customization requests" value={custom} onChange={setCustom} />
          <SelectField label="Budget range" value={budget} onChange={setBudget} options={budgetRanges} />
          <TextArea label="Message" value={message} onChange={setMessage} />
          <Button type="submit" disabled={show && !valid}>
            Send inquiry
          </Button>
        </form>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a className="btn btn-outline" href={`tel:${PHONE_TEL}`}>Call</a>
          <a className="btn btn-outline" href={`mailto:${EMAIL}`}>Email</a>
        </div>
      </div>
    </Screen>
  );
}
