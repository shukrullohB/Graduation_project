import InteractiveTilt from "./InteractiveTilt";

export default function MetricCard({
  icon,
  label,
  value,
  trend,
  tone = "brand",
}) {
  return (
    <InteractiveTilt
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className="metric-card"
      data-tone={tone}
      maxTilt={7}
    >
      <div className="metric-icon">{icon}</div>
      <div className="space-y-1">
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
      </div>
      {trend ? <p className="metric-trend">{trend}</p> : null}
    </InteractiveTilt>
  );
}
