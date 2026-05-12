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

const clampPercent = (value) => Math.max(0, Math.min(100, value));

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
  const primaryAverageValue = Number(primaryAverage);
  const comparedAverageValue = Number(comparedAverage);
  const reviewCoverage = clampPercent(
    totalItems ? Math.round((distribution[0]?.count ?? 0) / totalItems * 100) : 0,
  );
  const alignmentGap = Math.abs(primaryAverageValue - comparedAverageValue).toFixed(1);
  const topBucket = distribution.reduce(
    (best, item) => ((item?.count ?? 0) > (best?.count ?? 0) ? item : best),
    distribution[0] ?? { range: "No data", count: 0 },
  );
  const topMistake = mistakes.reduce(
    (best, item) =>
      ((item?.mistakes ?? 0) > (best?.mistakes ?? 0) ? item : best),
    mistakes[0] ?? { subject: "No data", mistakes: 0 },
  );
  const trendBars = metricsFromValues([
    primaryAverageValue,
    comparedAverageValue,
    totalItems,
    totalMistakes,
  ]);

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

  const spotlight = [
    {
      label: isTeacher ? "Review coverage" : "Scored submissions",
      value: `${reviewCoverage}%`,
      note: isTeacher
        ? "How much of the queue already has final teacher validation."
        : "How much of your work already has a final score on record.",
    },
    {
      label: "Score alignment gap",
      value: `${alignmentGap} pts`,
      note: "The smaller this gap is, the closer AI and final judgement are.",
    },
    {
      label: "Dominant bucket",
      value: topBucket?.range ?? "No data",
      note: `${topBucket?.count ?? 0} submissions currently cluster here.`,
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
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white md:text-base">
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
          <GlassPanel
            key={metric.label}
            className="group relative overflow-hidden p-5 transition duration-200 hover:border-[#0047FF]/35 hover:bg-[#0047FF]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${metricPalette[index]} opacity-100 transition duration-200 group-hover:opacity-0`}
            />
            <div className="relative transition duration-200 group-hover:text-white">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6F7F9D] transition duration-200 group-hover:text-white/78">
                {metric.label}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-[#16305F] transition duration-200 group-hover:text-white">
                  {metric.value}
                </span>
                {metric.suffix ? (
                  <span className="pb-1 text-sm text-[#6F7F9D] transition duration-200 group-hover:text-white/78">
                    {metric.suffix}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#556581] transition duration-200 group-hover:text-white/88">
                {metric.note}
              </p>
              <div className="mt-5 flex items-end gap-1.5">
                {trendBars[index].map((height, barIndex) => (
                  <span
                    key={`${metric.label}-${barIndex}`}
                    className="w-2 rounded-full bg-[#0047FF]/18 transition duration-200 group-hover:bg-white/26"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>
          </GlassPanel>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <GlassPanel className="relative overflow-hidden p-5 md:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,224,122,0.18),transparent_28%)]" />
          <div className="relative">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                  Core Trend
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
                  Average Score by Subject
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {avgCards.map((item, index) => (
                  <span
                    key={item.subject}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      index === 0
                        ? "border-[#0047FF]/14 bg-white/84 text-[#0047FF]"
                        : "border-[#D9E4FF] bg-[#FFF8E7] text-[#6F7F9D]"
                    }`}
                  >
                    {item.subject}: {Number(item.avgScore ?? 0).toFixed(1)}
                  </span>
                ))}
              </div>
            </div>
            <Suspense fallback={chartFallback}>
              <AverageScore data={avgCards} />
            </Suspense>
          </div>
        </GlassPanel>

        <div className="grid gap-5">
          <GlassPanel className="relative overflow-hidden p-5 md:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,71,255,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                    Snapshot
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
                    Quality Radar
                  </h3>
                </div>
                <div
                  className="grid h-[112px] w-[112px] place-items-center rounded-full border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]"
                  style={{
                    background: `conic-gradient(#0047FF 0deg ${reviewCoverage * 3.6}deg, rgba(0,71,255,0.12) ${reviewCoverage * 3.6}deg 360deg)`,
                  }}
                >
                  <div className="grid h-[82px] w-[82px] place-items-center rounded-full bg-[#FFF8E7] text-center shadow-[0_10px_22px_rgba(0,71,255,0.08)]">
                    <strong className="text-2xl font-semibold tracking-tight text-[#16305F]">
                      {reviewCoverage}%
                    </strong>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#6F7F9D]">
                      Coverage
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {spotlight.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[#0047FF]/10 bg-white/78 px-4 py-4 shadow-[0_14px_30px_rgba(0,71,255,0.05)]"
                  >
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F7F9D]">
                        {item.label}
                      </p>
                      <strong className="text-lg font-semibold text-[#16305F]">
                        {item.value}
                      </strong>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#556581]">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative overflow-hidden p-5 md:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,71,255,0.06),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,224,122,0.16),transparent_28%)]" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                    Friction Map
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
                    Common Mistakes
                  </h3>
                </div>
                <span className="rounded-full border border-[#0047FF]/12 bg-white/80 px-3 py-1 text-xs text-[#6F7F9D]">
                  Peak: {topMistake?.subject ?? "No data"}
                </span>
              </div>
              <Suspense fallback={chartFallback}>
                <Mistakes data={mistakes} />
              </Suspense>
            </div>
          </GlassPanel>
        </div>
      </section>

      <GlassPanel className="relative overflow-hidden p-5 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.06),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,240,199,0.7),transparent_32%)]" />
        <div className="relative">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                Histogram
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
                Score Distribution
              </h3>
            </div>
            <div className="max-w-2xl space-y-3">
              <p className="text-sm leading-6 text-[#6F7F9D]">
                This view shows where most scores cluster so you can spot compression, weak ranges, and standout bands faster.
              </p>
              <div className="flex flex-wrap gap-2">
                {distribution.map((item, index) => (
                  <span
                    key={item.range}
                    className="rounded-full border border-[#0047FF]/10 bg-white/82 px-3 py-1 text-xs text-[#556581]"
                  >
                    <span
                      className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                      style={{
                        background:
                          ["#0047FF", "#2F74FF", "#7FA6FF", "#A9C2FF"][index % 4],
                      }}
                    />
                    {item.range}: {item.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Suspense fallback={chartFallback}>
            <ScoreDistribution data={distribution} />
          </Suspense>
        </div>
      </GlassPanel>
    </PageTransition>
  );
}

function metricsFromValues(values) {
  return values.map((value, index) => {
    const base = Math.max(1, Number(value) || 0);
    return Array.from({ length: 7 }, (_, barIndex) => {
      const wave = ((base + (index + 1) * 9 + barIndex * 7) % 28) + 10;
      return wave;
    });
  });
}
