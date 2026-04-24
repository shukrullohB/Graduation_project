0.
import { Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getStudentAnalytics, getTeacherAnalytics } from "../api/analytics.api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import MetricCard from "../components/ui/MetricCard";
import InteractiveTilt from "../components/ui/InteractiveTilt";

const AverageScore = lazy(() => import("../components/charts/AverageScore"));
const Mistakes = lazy(() => import("../components/charts/Mistakes"));
const ScoreDistribution = lazy(
  () => import("../components/charts/ScoreDistribution"),
);

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

  if (isLoading)
    return <LoadingSpinner text="Building analytics snapshots..." />;

  const avgCards = analytics?.avgScores ?? [];
  const distribution = analytics?.distribution ?? [];
  const mistakes = analytics?.mistakes ?? [];
  const primaryAverage = Number(avgCards[0]?.avgScore ?? 0).toFixed(2);
  const comparedAverage = Number(avgCards[1]?.avgScore ?? 0).toFixed(2);
  const totalItems = distribution.reduce((sum, d) => sum + (d.count || 0), 0);
  const pendingMetric = mistakes.find((m) =>
    String(m.subject || "")
      .toLowerCase()
      .includes("pending"),
  )?.mistakes;

  const chartFallback = (
    <div className="h-[320px] animate-pulse rounded-2xl border border-slate-300/70 bg-white/50 dark:border-white/15 dark:bg-white/5" />
  );

  return (
    <PageTransition className="space-y-4">
      <InteractiveTilt maxTilt={4}>
        <GlassPanel className="p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
            {isTeacher ? "Teacher" : "Student"} Analytics
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            Performance Intelligence
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Explore score trends, detect learning gaps, and turn grading data
            into immediate teaching decisions.
          </p>
        </GlassPanel>
      </InteractiveTilt>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="📈"
          label="Primary Average"
          value={primaryAverage}
          tone="brand"
        />
        <MetricCard
          icon="🤖"
          label="AI Compare Avg"
          value={comparedAverage}
          tone="violet"
        />
        <MetricCard
          icon="📦"
          label="Total Items"
          value={totalItems}
          tone="mint"
        />
        <MetricCard
          icon="⏳"
          label="Pending/Flagged"
          value={pendingMetric ?? 0}
          tone="amber"
        />
      </section>

      <Suspense fallback={chartFallback}>
        <section className="grid gap-3 xl:grid-cols-2">
          <InteractiveTilt maxTilt={3}>
            <div className="chart-shell chart-shell-interactive">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Average Score by Subject
                </h3>
                <span className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Core trend
                </span>
              </div>
              <AverageScore data={avgCards} />
            </div>
          </InteractiveTilt>

          <InteractiveTilt maxTilt={3}>
            <div className="chart-shell chart-shell-interactive">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Common Mistakes
                </h3>
                <span className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Focus topics
                </span>
              </div>
              <Mistakes data={mistakes} />
            </div>
          </InteractiveTilt>

          <InteractiveTilt className="xl:col-span-2" maxTilt={2.5}>
            <div className="chart-shell chart-shell-interactive">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Score Distribution
                </h3>
                <span className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Spread pattern
                </span>
              </div>
              <ScoreDistribution data={distribution} />
            </div>
          </InteractiveTilt>
        </section>
      </Suspense>
    </PageTransition>
  );
}
