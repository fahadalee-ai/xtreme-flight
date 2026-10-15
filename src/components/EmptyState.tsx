import type { ReactNode } from "react";

export function EmptyState({
  image,
  title,
  body,
  action,
}: {
  image: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-4 py-6 text-center">
      <img src={image} alt="" className="mx-auto h-52 w-full max-w-sm rounded-[18px] object-cover" />
      <h2 className="mt-4 font-display text-[24px] uppercase leading-7">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-[15px] leading-[22px] text-[#9ca3af]">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
