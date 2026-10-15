import { useState } from "react";
import { images } from "@/img/images";
import { packages } from "@/data/content";
import { Button, GuestWall, Header, Screen, StickyBar, TextArea, TextField } from "@/components/chrome";
import { ShareSheet } from "@/components/ShareSheet";
import { SkeletonPage } from "@/components/Skeleton";
import { EMAIL, PHONE_DISPLAY, emailOk, money } from "@/lib/format";
import { useApp } from "@/store/app-store";
import type { PackageId } from "@/data/types";
import { packageById } from "@/data/content";

export function GiftBuyScreen() {
  const app = useApp();
  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState<PackageId | "custom">("video");
  const [custom, setCustom] = useState("250");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState(app.user?.name || "");
  const [message, setMessage] = useState("Go fly.");
  const [delivery, setDelivery] = useState("");
  const [card, setCard] = useState("");
  const [done, setDone] = useState<{ code: string; id: string } | null>(null);
  const [share, setShare] = useState(false);

  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) return <GuestWall title="Buy a gift" body="Sign in to send a digital gift certificate." />;

  const amount = packageId === "custom" ? Number(custom) || 0 : packageById(packageId)?.price || 0;
  const detailsOk = recipientName.trim().length > 1 && emailOk(recipientEmail) && senderName.trim().length > 1 && amount >= 50;
  const pkgName = packageId === "custom" ? "Custom amount" : packageById(packageId)?.name;

  const buy = () => {
    const cert = app.buyCertificate({
      packageId: packageId === "custom" ? undefined : packageId,
      amount,
      recipientName,
      recipientEmail,
      senderName,
      message,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
      delivery: delivery || new Date().toISOString().slice(0, 10),
    });
    if (cert) setDone({ code: cert.code, id: cert.id });
  };

  if (done) {
    return (
      <Screen>
        <Header title="Sent" back="/gifts" />
        <div className="px-4">
          <CertificatePreview code={done.code} name={recipientName} from={senderName} detail={pkgName || ""} message={message} />
          <div className="mt-4 space-y-2">
            <Button onClick={() => setShare(true)}>Share</Button>
            <Button
              variant="outline"
              onClick={() => {
                const html = `<html><body style="font-family:sans-serif;background:#111827;color:white;padding:24px"><h1>Xtreme Flight</h1><p>${done.code}</p><p>${pkgName} for ${recipientName}</p><p>${message}</p></body></html>`;
                const w = window.open("", "_blank", "noopener,noreferrer");
                if (!w) return;
                w.document.write(html);
                w.document.close();
                w.focus();
                w.print();
              }}
            >
              Print / Save as PDF
            </Button>
          </div>
        </div>
        <ShareSheet open={share} onClose={() => setShare(false)} url="https://xtreme-flight.com/" caption={`A flight is waiting. Code ${done.code}`} />
      </Screen>
    );
  }

  return (
    <Screen className="pb-28">
      <Header title="Buy a gift" back={step === 0 ? "/gifts" : () => setStep((s) => s - 1)} />
      <div className="ios-stack">
        {step === 0 && (
          <>
            {packages.map((pkg) => (
              <button key={pkg.id} type="button" onClick={() => setPackageId(pkg.id)} className={`card w-full p-4 text-left ${packageId === pkg.id ? "ring-2 ring-lime" : ""}`}>
                <span className="flex justify-between font-display text-[18px] uppercase">
                  {pkg.name}
                  <span className="text-lime">{money(pkg.price)}</span>
                </span>
              </button>
            ))}
            <button type="button" onClick={() => setPackageId("custom")} className={`card w-full p-4 text-left ${packageId === "custom" ? "ring-2 ring-lime" : ""}`}>
              Custom amount
            </button>
            {packageId === "custom" ? <TextField label="Amount (USD)" inputMode="numeric" value={custom} onChange={setCustom} /> : null}
          </>
        )}
        {step === 1 && (
          <>
            <TextField label="Recipient name" value={recipientName} onChange={setRecipientName} />
            <TextField label="Recipient email" type="email" inputMode="email" value={recipientEmail} onChange={setRecipientEmail} />
            <TextField label="Your name" value={senderName} onChange={setSenderName} />
            <TextArea label="Personal message" value={message} onChange={setMessage} />
            <TextField label="Delivery date" type="date" value={delivery} onChange={setDelivery} hint="Leave blank to send now." />
          </>
        )}
        {step === 2 && <CertificatePreview code="XF-••••" name={recipientName || "Recipient"} from={senderName} detail={`${pkgName} · ${money(amount)}`} message={message} />}
        {step === 3 && (
          <>
            <p className="text-[14px]">Total {money(amount)}. The price you see is the price you pay.</p>
            <TextField label="Card number" inputMode="numeric" value={card} onChange={setCard} placeholder="4242 4242 4242 4242" />
            <p className="text-[12px] leading-4 text-[#9ca3af]">Prefer to order by phone? Call {PHONE_DISPLAY} or email {EMAIL}.</p>
          </>
        )}
      </div>
      <StickyBar>
        <Button
          disabled={(step === 1 && !detailsOk) || (step === 3 && card.replace(/\D/g, "").length < 15) || (step === 0 && amount < 50)}
          onClick={() => (step < 3 ? setStep((s) => s + 1) : buy())}
        >
          {step === 3 ? `Pay ${money(amount)}` : "Continue"}
        </Button>
      </StickyBar>
    </Screen>
  );
}

export function CertificatePreview({ code, name, from, detail, message }: { code: string; name: string; from: string; detail: string; message: string }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-lime/40 bg-[#161e16]">
      <img src={images.logoOnDark} alt="Xtreme Flight" className="logo-knockout mx-auto mt-4 h-12 w-auto" />
      <div className="p-4 text-center">
        <p className="text-[12px] uppercase tracking-[0.18em] text-lime">Gift of flight</p>
        <p className="mt-2 font-display text-[22px] uppercase">{detail}</p>
        <p className="mt-2 text-[14px]">For {name}</p>
        <p className="text-[13px] text-[#9ca3af]">From {from}</p>
        <p className="mt-3 text-[14px] leading-5">“{message}”</p>
        <p className="mt-3 font-display text-[20px] tracking-widest text-lime">{code}</p>
      </div>
    </article>
  );
}
