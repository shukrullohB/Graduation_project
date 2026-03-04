import { useQuery } from "@tanstack/react-query";
import {
  fetchDistribution,
  fetchMistakes,
  fetchSummary,
} from "../api/analytics.api";
import AverageScore from "../components/charts/AverageScore";
import Mistakes from "../components/charts/Mistakes";
import ScoreDistribution from "../components/charts/ScoreDistribution";

const AnalyticsDashboard = () => {
  const {
    data: summary,
    isLoading: loadingSummary,
    isError: errorSummary,
  } = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: fetchSummary,
  });

  const { data: distribution, isLoading: loadingDistribution } = useQuery({
    queryKey: ["analytics", "distribution"],
    queryFn: fetchDistribution,
  });

  const { data: mistakes, isLoading: loadingMistakes } = useQuery({
    queryKey: ["analytics", "mistakes"],
    queryFn: fetchMistakes,
  });

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Teacher</p>
          <h1>Analytics</h1>
        </div>
      </div>

      {loadingSummary && <p className="muted">Loading summary…</p>}
      {errorSummary && <p className="error">Could not load summary.</p>}
      {summary && (
        <AverageScore
          average={summary.average_score}
          total={summary.total_answers}
          pending={summary.pending_reviews}
        />
      )}

      <div className="grid grid--two">
        {loadingDistribution ? (
          <div className="card">
            <p className="muted">Loading distribution…</p>
          </div>
        ) : (
          <ScoreDistribution data={distribution} />
        )}
        {loadingMistakes ? (
          <div className="card">
            <p className="muted">Loading mistakes…</p>
          </div>
        ) : (
          <Mistakes data={mistakes} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
