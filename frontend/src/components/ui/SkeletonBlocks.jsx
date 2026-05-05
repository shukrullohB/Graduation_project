export default function SkeletonBlocks() {
  return (
    <div className="space-y-4">
      <div
        style={{
          height: "32px",
          width: "224px",
          borderRadius: "8px",
          background: "rgba(0,71,255,0.08)",
          animation: "shimmer 2s infinite",
        }}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <div
          style={{
            height: "112px",
            borderRadius: "12px",
            background: "rgba(0,71,255,0.08)",
            animation: "shimmer 2s infinite",
          }}
        />
        <div
          style={{
            height: "112px",
            borderRadius: "12px",
            background: "rgba(0,71,255,0.08)",
            animation: "shimmer 2s infinite",
          }}
        />
        <div
          style={{
            height: "112px",
            borderRadius: "12px",
            background: "rgba(0,71,255,0.08)",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div
          style={{
            height: "224px",
            borderRadius: "12px",
            background: "rgba(0,71,255,0.08)",
            animation: "shimmer 2s infinite",
          }}
        />
        <div
          style={{
            height: "224px",
            borderRadius: "12px",
            background: "rgba(0,71,255,0.08)",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>
    </div>
  );
}
