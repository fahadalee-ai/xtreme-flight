import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { Button, GuestWall, Header, Screen, TextField } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { formatDate, money } from "@/lib/format";
import { useGo } from "@/lib/nav";
import { useApp, useMine } from "@/store/app-store";

export function PaymentsScreen() {
  const app = useApp();
  const mine = useMine();
  const go = useGo();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [name, setName] = useState(app.user?.name || "");
  if (!app.hydrated) return <SkeletonPage />;
  if (!app.user) return <GuestWall title="Payments" body="Sign in to see cards and receipts." />;
  return (
    <Screen>
      <Header title="Payments" />
      <div className="ios-stack">
        <h2 className="font-display text-[18px] uppercase">Cards</h2>
        {app.cards.map((card) => (
          <article key={card.id} className="card p-4">
            <p className="font-display text-[20px] uppercase">{card.brand} ••{card.last4}</p>
            <p className="text-[12px] text-[#9ca3af]">Exp {card.exp} · {name || app.user?.name}</p>
          </article>
        ))}
        <Button variant="outline" onClick={() => setOpen(true)}>Add card</Button>
        <h2 className="pt-2 font-display text-[18px] uppercase">Receipts</h2>
        {mine.receipts.length === 0 ? <p className="text-[14px] text-[#9ca3af]">No payments yet.</p> : null}
        {mine.receipts.map((r) => (
          <button key={r.id} type="button" onClick={() => go(`/receipts/${r.id}`)} className="press card w-full p-4 text-left">
            <span className="flex justify-between">
              <span>{r.ref}</span>
              <span className="text-lime">{money(r.amount)}</span>
            </span>
            <span className="mt-1 block text-[12px] text-[#9ca3af]">{formatDate(r.date)} · {r.method}</span>
          </button>
        ))}
      </div>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Add card">
        <div className="space-y-3">
          <TextField label="Name" value={name} onChange={setName} />
          <TextField label="Card number" inputMode="numeric" value={number} onChange={setNumber} />
          <TextField label="Expiry" value={exp} onChange={setExp} placeholder="MM/YY" />
          <Button
            disabled={number.replace(/\D/g, "").length < 15 || !/^\d{2}\/\d{2}$/.test(exp)}
            onClick={() => {
              const digits = number.replace(/\D/g, "");
              const brand = digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card";
              app.addCard({ brand, last4: digits.slice(-4), exp });
              setOpen(false);
              setNumber("");
              app.pushToast("Card saved");
            }}
          >
            Save card
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
