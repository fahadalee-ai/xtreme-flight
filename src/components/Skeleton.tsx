export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonPage() {
  return (
    <div className="space-y-3 px-4 pt-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-3 px-4">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
  );
}
