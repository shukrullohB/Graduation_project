import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSummary } from "../api/analytics.api";
import ScoreBadge from "../components/ScoreBadge";

const TeacherDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: fetchSummary,
  });

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Teacher</p>
          <h1>Overview</h1>
        </div>
        <div className="stack">
          <Link className="btn" to="/teacher/review">
            Pending Reviews
          </Link>
          <Link className="btn btn-ghost" to="/teacher/analytics">
            View Analytics
          </Link>
        </div>
      </div>

      {isLoading && <p className="muted">Loading summary…</p>}
      {isError && <p className="error">Could not load summary.</p>}

      {data && (
        <div className="grid grid--three">
          <div className="card">
            <div className="muted">Average Score</div>
            <ScoreBadge score={data.average_score} />
          </div>
          <div className="card">
            <div className="muted">Total Answers</div>
            <div className="metric">{data.total_answers}</div>
          </div>
          <div className="card">
            <div className="muted">Pending Reviews</div>
            <div className="metric">{data.pending_reviews}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
