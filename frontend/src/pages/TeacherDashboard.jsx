import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPendingAnswers } from "../api/review.api";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";

export default function TeacherDashboard() {
  const { data: pending } = useQuery({
    queryKey: ["pending-answers"],
    queryFn: getPendingAnswers,
  });

  const pendingList = Array.isArray(pending) ? pending : [];
  const pendingCount = pendingList.length;
  const uniqueStudents = new Set(pendingList.map((a) => a.student_id)).size;
  const avgAnswerSize = pendingCount
    ? Math.round(
        pendingList.reduce(
          (sum, item) => sum + (item.answer_text?.length || 0),
          0,
        ) / pendingCount,
      )
    : 0;

  const metrics = [
    {
      label: "Answers in queue",
      value: pendingCount,
      note: "Need final teacher approval",
    },
    {
      label: "Students waiting",
      value: uniqueStudents,
      note: "Unique learners awaiting feedback",
    },
    {
      label: "Average answer length",
      value: `${avgAnswerSize} ch`,
      note: "Useful for estimating review effort",
    },
  ];

  return (
    <PageTransition className="space-y-6">
      <GlassPanel className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(145deg,rgba(0,71,255,0.96),rgba(26,88,255,0.92))]" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/78">
              Teacher Analytics
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#FFF8E7] md:text-4xl">
              Grading Command Center
            </h2>
            <p
              className="mt-4 max-w-2xl text-sm leading-7 md:text-base"
              style={{ color: "rgba(255, 248, 231, 0.92)" }}
            >
              Prioritize pending answers, keep review flow consistent, and move from AI suggestion to final teacher scoring faster.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/18 bg-white/14 p-4 text-sm text-white/80">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/72">
              Queue status
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#FFF8E7]">
              {pendingCount} pending
            </p>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <GlassPanel key={metric.label} className="relative overflow-hidden p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.08),transparent_34%)]" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6F7F9D]">
                {metric.label}
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-tight text-[#16305F]">
                {metric.value}
              </p>
              <p className="mt-4 text-sm leading-6 text-[#556581]">{metric.note}</p>
            </div>
          </GlassPanel>
        ))}
      </section>

      <GlassPanel className="p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
              Review Queue
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#16305F]">
              Latest submissions needing review
            </h3>
          </div>
          <span className="rounded-full border border-[#0047FF]/12 bg-[#FFF8E7] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#6F7F9D]">
            Sorted by latest submissions
          </span>
        </div>

        {pendingCount === 0 ? (
          <div className="grid place-items-center rounded-[28px] border border-[#0047FF]/12 bg-[#FFF8E7] px-6 py-14 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[#0047FF]/18 bg-[#0047FF]/10 text-xl text-[#0047FF]">
                ✓
              </div>
              <p className="mt-5 text-lg font-semibold text-[#16305F]">
                All clear, no pending reviews.
              </p>
              <p className="mt-2 text-sm leading-6 text-[#556581]">
                Your grading queue is fully up to date.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {pendingList.map((answer) => (
              <div
                key={answer.id}
                className="rounded-[28px] border border-[#0047FF]/12 bg-white/92 p-5 transition duration-150 hover:border-[#0047FF]/22 hover:bg-white"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[#0047FF]/18 bg-[#0047FF]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#0047FF]">
                        Pending
                      </span>
                      <span className="text-sm text-[#6F7F9D]">
                        {answer.student_username}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#16305F]">
                      {answer.question_title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#556581]">
                      {answer.answer_text?.slice(0, 220)}
                      {answer.answer_text?.length > 220 ? "..." : ""}
                    </p>
                  </div>

                  <Link
                    to={`/teacher/review/${answer.id}`}
                    className="btn-premium min-w-[170px] justify-center"
                  >
                    Review Answer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </PageTransition>
  );
}
