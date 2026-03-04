import ScoreBadge from "../ScoreBadge";

const AverageScore = ({ average, total, pending }) => (
  <div className="card average-card">
    <div className="card__header">
      <h3>Overview</h3>
    </div>
    <div className="average-card__content">
      <div>
        <div className="muted">Average Score</div>
        <ScoreBadge score={average ?? 0} />
      </div>
      <div>
        <div className="muted">Total Answers</div>
        <div className="metric">{total ?? 0}</div>
      </div>
      <div>
        <div className="muted">Pending Reviews</div>
        <div className="metric">{pending ?? 0}</div>
      </div>
    </div>
  </div>
);

export default AverageScore;
