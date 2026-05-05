import { Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getStudentAnalytics, getTeacherAnalytics } from "../api/analytics.api";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";

const AverageScore = lazy(() => import("../components/charts/AverageScore"));
const Mistakes = lazy(() => import("../components/charts/Mistakes"));
const ScoreDistribution = lazy(
  () => import("../components/charts/ScoreDistribution"),
);

const metricPalette = [
  "from-[#0047FF]/10 via-[#0047FF]/4 to-transparent",
  "from-[#FFF8E7] via-[#0047FF]/6 to-transparent",
  "from-[#0047FF]/8 via-[#FFF8E7] to-transparent",
  "from-[#FFF0C7] via-[#0047FF]/6 to-transparent",
];

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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <LoadingSpinner text="Building analytics snapshots..." />
      </div>
    );
  }

  const avgCards = analytics?.avgScores ?? [];
  const distribution = analytics?.distribution ?? [];
  const mistakes = analytics?.mistakes ?? [];
  const primaryAverage = Number(avgCards[0]?.avgScore ?? 0).toFixed(1);
  const comparedAverage = Number(avgCards[1]?.avgScore ?? 0).toFixed(1);
  const totalItems = distribution.reduce((sum, d) => sum + (d.count || 0), 0);
  const totalMistakes = mistakes.reduce((sum, item) => sum + (item.mistakes || 0), 0);

  const metrics = [
    {
      label: "Primary average",
      value: primaryAverage,
      suffix: "/100",
      note: isTeacher ? "Teacher grading baseline" : "Your strongest current lane",
    },
    {
      label: "AI compare",
      value: comparedAverage,
      suffix: "/100",
      note: "Model and manual evaluation alignment",
    },
    {
      label: "Total submissions",
      value: totalItems,
      note: "Data points currently in this view",
    },
    {
      label: "Mistake load",
      value: totalMistakes,
      note: "High-friction concepts worth revisiting",
    },
  ];

  const chartFallback = (
    <div className="grid h-[320px] place-items-center rounded-[28px] border border-[#0047FF]/12 bg-white/72">
      <p className="text-sm text-[#6F7F9D]">Loading chart...</p>
    </div>
  );

  return (
    <PageTransition className="space-y-6">
      <GlassPanel className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),linear-gradient(145deg,rgba(0,71,255,0.96),rgba(26,88,255,0.92))]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/78">
              {isTeacher ? "Teacher" : "Student"} Analytics
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#FFF8E7] md:text-4xl">
              Performance Intelligence Layer
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 md:text-base">
              See where scores are climbing, where understanding breaks down, and how the distribution is shifting over time.
            </p>
          </div>

          <div className="grid min-w-[250px] gap-3 rounded-[28px] border border-white/18 bg-white/14 p-4 text-sm text-white/82">
            <div className="flex items-center justify-between">
              <span>Mode</span>
              <strong className="font-semibold text-[#FFF8E7]">
                {isTeacher ? "Instructor View" : "Learner View"}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Tracked buckets</span>
              <strong className="font-semibold text-[#FFF8E7]">{distribution.length}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Subjects sampled</span>
              <strong className="font-semibold text-[#FFF8E7]">{avgCards.length}</strong>
            </div>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <GlassPanel key={metric.label} className="relative overflow-hidden p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${metricPalette[index]} opacity-100`} />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6F7F9D]">
                {metric.label}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-[#16305F]">
                  {metric.value}
                </span>
                {metric.suffix ? (
                  <span className="pb-1 text-sm text-[#6F7F9D]">{metric.suffix}</span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#556581]">{metric.note}</p>
            </div>
          </GlassPanel>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel className="p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                Core Trend
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
                Average Score by Subject
              </h3>
            </div>
          </div>
          <Suspense fallback={chartFallback}>
            <AverageScore data={avgCards} />
          </Suspense>
        </GlassPanel>

        <GlassPanel className="p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                Friction Map
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
                Common Mistakes
              </h3>
            </div>
          </div>
          <Suspense fallback={chartFallback}>
            <Mistakes data={mistakes} />
          </Suspense>
        </GlassPanel>
      </section>

      <GlassPanel className="p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
              Histogram
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
              Score Distribution
            </h3>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[#6F7F9D]">
            This view shows where most scores cluster so you can spot compression, weak ranges, and standout bands faster.
          </p>
        </div>
        <Suspense fallback={chartFallback}>
          <ScoreDistribution data={distribution} />
        </Suspense>
      </GlassPanel>
    </PageTransition>
  );
}
