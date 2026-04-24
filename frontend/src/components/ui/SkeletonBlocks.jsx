export default function SkeletonBlocks() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-56 rounded-xl bg-white/50 shimmer" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-28 rounded-2xl bg-white/55 shimmer" />
        <div className="h-28 rounded-2xl bg-white/55 shimmer" />
        <div className="h-28 rounded-2xl bg-white/55 shimmer" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-56 rounded-2xl bg-white/60 shimmer" />
        <div className="h-56 rounded-2xl bg-white/60 shimmer" />
      </div>
    </div>
  );
}
