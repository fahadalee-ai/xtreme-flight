import { useParams } from "@tanstack/react-router";
import { Header, Screen } from "@/components/chrome";
import { SkeletonPage } from "@/components/Skeleton";
import { QrCode } from "@/components/QrCode";
import { StatusChip } from "@/components/StatusChip";
import { packageById } from "@/data/content";
import { formatDate, money } from "@/lib/format";
import { useApp } from "@/store/app-store";

export function GiftDetailScreen() {
  const { certId } = useParams({ from: "/gifts/$certId" });
  const app = useApp();
  const cert = app.certificates.find((c) => c.id === certId);
  if (!app.hydrated) return <SkeletonPage />;
  if (!cert || cert.userId !== app.user?.id) {
    return (
      <Screen>
        <Header title="Certificate" />
        <p className="px-4 text-[#9ca3af]">Certificate not found.</p>
      </Screen>
    );
  }
  return (
    <Screen>
      <Header title={cert.code} />
      <div className="px-4 text-center">
        <QrCode value={cert.code} />
        <p className="mt-3 font-display text-[22px] tracking-wide text-lime">{cert.code}</p>
        <div className="mt-2 flex justify-center">
          <StatusChip status={cert.status} />
        </div>
        <article className="card mt-4 p-4 text-left text-[14px] leading-5">
          <p>{cert.packageId ? packageById(cert.packageId)?.name : `Custom ${money(cert.amount)}`}</p>
          <p>For {cert.recipientName}</p>
          <p>From {cert.senderName}</p>
          <p className="text-[#9ca3af]">“{cert.message}”</p>
          <p>Valid through {formatDate(cert.expires)}</p>
        </article>
        <section className="mt-4 text-left">
          <h2 className="font-display text-[18px] uppercase">Redemption history</h2>
          <ul className="mt-2 space-y-2">
            {cert.history.map((h) => (
              <li key={h.note} className="card px-3 py-3 text-[14px]">
                {formatDate(h.date)} · {h.note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
