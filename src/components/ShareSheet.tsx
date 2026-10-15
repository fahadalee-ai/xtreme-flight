import { BottomSheet } from "./BottomSheet";
import { socials } from "@/data/content";
import { useApp } from "@/store/app-store";

export function ShareSheet({
  open,
  onClose,
  url,
  caption = "I just flew an XA-42 with @xtreme.flight",
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  caption?: string;
}) {
  const { pushToast } = useApp();
  const share = async (href?: string) => {
    const text = `${caption} ${url}`;
    if (!href && navigator.share) {
      try {
        await navigator.share({ title: "Xtreme Flight", text, url });
        onClose();
        return;
      } catch {
        /* dismissed */
      }
    }
    if (href) window.open(href, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(text);
      pushToast("Caption copied", caption);
    } catch {
      pushToast("Share this", text);
    }
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Share">
      <p className="mb-3 text-[13px] leading-5 text-[#9ca3af]">{caption}</p>
      <div className="grid grid-cols-2 gap-2">
        {socials.map((s) => (
          <button key={s.id} type="button" className="btn btn-outline" onClick={() => share(s.href)}>
            {s.label}
          </button>
        ))}
        <button type="button" className="btn btn-outline" onClick={() => share("https://wa.me/?text=" + encodeURIComponent(`${caption} ${url}`))}>
          WhatsApp
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            void navigator.clipboard.writeText(url).then(() => pushToast("Link copied"));
            onClose();
          }}
        >
          Copy link
        </button>
        <button type="button" className="btn btn-primary col-span-2" onClick={() => share()}>
          More
        </button>
      </div>
    </BottomSheet>
  );
}
