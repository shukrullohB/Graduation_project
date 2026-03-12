import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getStudentAnalytics, getTeacherAnalytics } from "../api/analytics.api";
import AverageScore from "../components/charts/AverageScore";
import Mistakes from "../components/charts/Mistakes";
import ScoreDistribution from "../components/charts/ScoreDistribution";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", user?.role],
    queryFn: () =>
      isTeacher
        ? getTeacherAnalytics().then((r) => r.data)
        : getStudentAnalytics().then((r) => r.data),
  });

  if (isLoading) return <p>Loading analytics...</p>;

  return (
    <div className="analytics-page">
      <h2>{isTeacher ? "Teacher" : "Student"} Analytics</h2>

      <section className="chart-section">
        <h3>Average Score by Subject</h3>
        <AverageScore data={analytics?.avgScores ?? []} />
      </section>

      <section className="chart-section">
        <h3>Common Mistakes</h3>
        <Mistakes data={analytics?.mistakes ?? []} />
      </section>

      <section className="chart-section">
        <h3>Score Distribution</h3>
        <ScoreDistribution data={analytics?.distribution ?? []} />
      </section>
    </div>
  );
}
