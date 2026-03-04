const scoreTone = (score) => {
  if (score === null || score === undefined) return "neutral";
  if (score >= 4) return "positive";
  if (score >= 2.5) return "warning";
  return "negative";
};

const ScoreBadge = ({ score }) => {
  const tone = scoreTone(score);
  return (
    <span className={`score-badge score-badge--${tone}`}>{score ?? "—"}/5</span>
  );
};

export default ScoreBadge;
