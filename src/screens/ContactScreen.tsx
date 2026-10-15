import { useState } from "react";
import { Button, Header, Screen, SelectField, TextArea, TextField } from "@/components/chrome";
import { contactTopics } from "@/data/content";
import { emailOk, phoneOk } from "@/lib/format";
import { useApp } from "@/store/app-store";

export function ContactScreen() {
  const app = useApp();
  const [name, setName] = useState(app.user?.name || "");
  const [email, setEmail] = useState(app.user?.email || "");
  const [phone, setPhone] = useState(app.user?.phone || "");
  const [topic, setTopic] = useState("");
  const [ref, setRef] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");
  const [sent, setSent] = useState(false);
  const [show, setShow] = useState(false);
  const errors = {
    name: name.trim().length < 2 ? "Enter your name." : "",
    email: !emailOk(email) ? "Enter a valid email." : "",
    phone: phone && !phoneOk(phone) ? "Enter a valid phone or leave it blank." : "",
    topic: !topic ? "Choose a topic." : "",
    message: message.trim().length < 8 ? "Tell us a bit more." : "",
  };
  const valid = Object.values(errors).every((e) => !e);

  if (sent) {
    return (
      <Screen>
        <Header title="Contact" />
        <div className="px-4 text-center">
          <div className="check-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-3xl text-ink">✓</div>
          <h2 className="mt-4 font-display text-[24px] uppercase">Message sent</h2>
          <p className="mt-2 text-[14px] leading-5 text-[#9ca3af]">We'll reply to {email}. If this is about a flight today, call 601-XFLIGHT.</p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Contact" />
      <form
        className="ios-stack"
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
          if (!valid) return;
          setSent(true);
          app.pushToast("Message sent");
        }}
      >
        <TextField label="Name" value={name} onChange={setName} error={show ? errors.name : ""} />
        <TextField label="Email" type="email" inputMode="email" value={email} onChange={setEmail} error={show ? errors.email : ""} />
        <TextField label="Phone" type="tel" value={phone} onChange={setPhone} error={show ? errors.phone : ""} />
        <SelectField label="Topic" value={topic} onChange={setTopic} options={contactTopics} />
        {show && errors.topic ? <p className="text-[12px] text-danger">{errors.topic}</p> : null}
        <TextField label="Booking reference (optional)" value={ref} onChange={setRef} placeholder="XF-2026-0001" />
        <TextArea label="Message" value={message} onChange={setMessage} />
        {show && errors.message ? <p className="text-[12px] text-danger">{errors.message}</p> : null}
        <label className="block text-[12px] text-[#9ca3af]">
          Attachment
          <input
            className="mt-1 block w-full text-[14px]"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0]?.name || "")}
          />
          {file ? <span className="mt-1 block text-lime">{file}</span> : null}
        </label>
        <Button type="submit" disabled={show && !valid}>
          Submit
        </Button>
      </form>
    </Screen>
  );
}
