export default function ScoreBadge({ score }) {
  return (
    <span
      role="status"
      aria-label={`Score ${score} percent`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
        background: "rgba(0,71,255,0.12)",
        padding: "4px 12px",
        fontSize: "14px",
        fontWeight: "700",
        color: "#0047FF",
      }}
    >
      {score}%
    </span>
  );
}
