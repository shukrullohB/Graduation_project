export default function ScoreBadge({ score }) {
  const color = score >= 80 ? "green" : score >= 50 ? "orange" : "red";
  return <span className={`score-badge score-badge--${color}`}>{score}%</span>;
}
