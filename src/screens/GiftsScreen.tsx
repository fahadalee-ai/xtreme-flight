import { useState } from "react";
import { images } from "@/img/images";
import { Button, Header, Screen, Segmented, TextField } from "@/components/chrome";
import { EmptyState } from "@/components/EmptyState";
import { StatusChip } from "@/components/StatusChip";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, formatDate, money } from "@/lib/format";
import { useGo } from "@/lib/nav";
import { packageById } from "@/data/content";
import { useApp, useMine } from "@/store/app-store";

export function GiftsScreen() {
  const [tab, setTab] = useState("buy");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const app = useApp();
  const mine = useMine();
  const go = useGo();

  const redeem = () => {
    const cert = app.findCertificate(code);
    if (!cert) {
      setResult("invalid");
      return;
    }
    if (cert.status === "Redeemed") {
      setResult("used");
      return;
    }
    if (cert.status === "Expired") {
      setResult("expired");
      return;
    }
    setResult("valid");
    app.setRedirect("/book");
  };

  return (
    <Screen>
      <Header title="Gift Certificates" />
      <img src={images.giftCertificate} alt="Xtreme Flight gift certificate" className="mx-4 h-40 w-[calc(100%-2rem)] rounded-[18px] object-cover" />
      <div className="mt-4 px-4">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: "buy", label: "Buy" },
            { id: "mine", label: "My Certificates" },
            { id: "redeem", label: "Redeem" },
          ]}
        />
      </div>
      {tab === "buy" && (
        <div className="mt-4 space-y-3 px-4">
          <p className="text-[15px] leading-[22px]">Give a real aerobatic flight. Digital certificates can be sent now or on a date you choose.</p>
          <Button onClick={() => (app.user ? go("/gifts/buy") : go("/login"))}>Buy a certificate</Button>
          <article className="card p-4 text-[14px] leading-5">
            Prefer to order by phone? Call {PHONE_DISPLAY} or email {EMAIL}.
            <a className="mt-3 btn btn-outline" href={`tel:${PHONE_TEL}`}>Call 601-XFLIGHT</a>
          </article>
        </div>
      )}
      {tab === "mine" && (
        <div className="mt-4">
          {!app.user || mine.certs.length === 0 ? (
            <EmptyState image={images.emptyGifts} title="No certificates yet" body="Buy one for someone else, or redeem a code you were sent." action={<Button onClick={() => go("/gifts/buy")}>Buy</Button>} />
          ) : (
            <div className="space-y-3 px-4">
              {mine.certs.map((cert) => (
                <button key={cert.id} type="button" onClick={() => go(`/gifts/${cert.id}`)} className="press card w-full p-4 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-[16px] tracking-wide">{cert.code}</p>
                      <p className="text-[13px] text-[#9ca3af]">{cert.packageId ? packageById(cert.packageId)?.name : money(cert.amount)}</p>
                      <p className="text-[12px] text-[#9ca3af]">Valid through {formatDate(cert.expires)}</p>
                    </div>
                    <StatusChip status={cert.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === "redeem" && (
        <div className="ios-stack">
          <TextField label="Certificate code" value={code} onChange={setCode} placeholder="XF-GIFT-7K2M" />
          <Button disabled={code.trim().length < 4} onClick={redeem}>
            Validate
          </Button>
          {result === "valid" ? <p className="text-[14px] text-lime">Valid. Apply it on the gift step when you book.</p> : null}
          {result === "invalid" ? <p className="text-[14px] text-danger">That code is not valid.</p> : null}
          {result === "expired" ? <p className="text-[14px] text-danger">That certificate has expired.</p> : null}
          {result === "used" ? <p className="text-[14px] text-danger">That certificate was already used.</p> : null}
          {result === "valid" ? (
            <Button variant="outline" onClick={() => (app.user ? go("/book") : go("/login"))}>
              Apply at booking
            </Button>
          ) : null}
        </div>
      )}
    </Screen>
  );
}
