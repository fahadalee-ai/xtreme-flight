import { useParams } from "@tanstack/react-router";
import { images } from "@/img/images";
import { Button, Header, Screen } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { ADDRESS, formatDate, money } from "@/lib/format";
import { useApp } from "@/store/app-store";

export function ReceiptScreen() {
  const { receiptId } = useParams({ from: "/receipts/$receiptId" });
  const app = useApp();
  const receipt = app.receipts.find((r) => r.id === receiptId);
  if (!app.hydrated) return <SkeletonPage />;
  if (!receipt || receipt.userId !== app.user?.id) {
    return (
      <Screen>
        <Header title="Receipt" />
        <p className="px-4 text-[#9ca3af]">Receipt not found.</p>
      </Screen>
    );
  }
  const print = () => {
    const html = `<html><head><title>${receipt.ref}</title></head><body style="font-family:sans-serif;padding:32px"><h1>Xtreme Flight</h1><p>${receipt.ref}</p><p>${receipt.detail}</p><p>${formatDate(receipt.date)}</p><p>${money(receipt.amount)} · ${receipt.method}</p><p>${ADDRESS}</p><p>The price you see is the price you pay.</p></body></html>`;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };
  return (
    <Screen>
      <Header title="Receipt" />
      <article className="mx-4 rounded-[18px] bg-white p-5 text-[#111827]">
        <img src={images.logo} alt="Xtreme Flight" className="h-10 w-auto" />
        <p className="mt-4 text-[12px] uppercase tracking-wide">Receipt</p>
        <h1 className="font-display text-[28px] uppercase">{receipt.ref}</h1>
        <p className="mt-2">{receipt.detail}</p>
        <p>{formatDate(receipt.date)}</p>
        <p className="mt-3 text-[22px] font-semibold">{money(receipt.amount)}</p>
        <p>{receipt.method}</p>
        <p className="mt-3 text-[13px]">{ADDRESS}</p>
        <p className="mt-2 text-[12px]">The price you see is the price you pay. No upsells. No fuel surcharges.</p>
      </article>
      <div className="px-4 pt-4">
        <Button onClick={print}>Download PDF</Button>
      </div>
    </Screen>
  );
}
