export default function MetricCard({ icon, label, value, trend }) {
  return (
    <div
      className="metric-card"
      style={{
        background: "rgba(0,71,255, 0.06)",
        border: "1px solid rgba(0,71,255, 0.2)",
        borderRadius: 12,
        padding: 24,
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(0,71,255, 0.15)",
          borderRadius: 8,
          padding: 10,
          display: "inline-flex",
          color: "#0047FF",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            color: "rgba(255,248,231,0.5)",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </p>
        <p style={{ color: "#FFF8E7", fontSize: 36, fontWeight: 700 }}>
          {value}
        </p>
        {trend && (
          <p style={{ color: "rgba(255,248,231,0.5)", fontSize: 12, marginTop: 8 }}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}


