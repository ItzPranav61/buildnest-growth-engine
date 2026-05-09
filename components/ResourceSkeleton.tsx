export function ResourceSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="min-h-72 rounded-xl border border-[#E2D8C9] bg-[#FFFDFC] p-6 shadow-[0_16px_36px_rgba(36,48,65,0.13)]">
          <div className="flex gap-2">
            <div className="h-5 w-24 rounded-full bg-soft" />
            <div className="h-5 w-16 rounded-full bg-panel" />
          </div>
          <div className="mt-5 h-6 w-3/4 rounded bg-soft" />
          <div className="mt-3 h-4 w-1/2 rounded bg-panel" />
          <div className="mt-5 space-y-2">
            <div className="h-4 rounded bg-soft" />
            <div className="h-4 w-5/6 rounded bg-panel" />
          </div>
          <div className="mt-6 flex gap-3">
            <div className="h-11 flex-1 rounded-full bg-soft" />
            <div className="h-11 w-32 rounded-full bg-panel" />
          </div>
        </div>
      ))}
    </div>
  );
}
