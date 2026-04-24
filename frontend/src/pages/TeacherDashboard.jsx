import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPendingAnswers } from "../api/review.api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import MetricCard from "../components/ui/MetricCard";
import InteractiveTilt from "../components/ui/InteractiveTilt";

export default function TeacherDashboard() {
  const { data: pending, isLoading } = useQuery({
    queryKey: ["pendingAnswers"],
    queryFn: () => getPendingAnswers().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner text="Syncing pending reviews..." />;

  const pendingCount = pending?.length ?? 0;
  const uniqueStudents = new Set((pending || []).map((a) => a.student_id)).size;
  const avgAnswerSize = pendingCount
    ? Math.round(
        pending.reduce(
          (sum, item) => sum + (item.answer_text?.length || 0),
          0,
        ) / pendingCount,
      )
    : 0;

  return (
    <PageTransition className="stage-spotlight space-y-4">
      <GlassPanel className="stage-spotlight overflow-hidden p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              Teacher Analytics
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
              Grading Command Center
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Prioritize pending answers, apply AI recommendations faster, and
              close the loop with consistent final scoring.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-300/45 bg-amber-100/70 px-4 py-2 text-sm font-medium text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            {pendingCount} pending review{pendingCount === 1 ? "" : "s"}
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          icon="📝"
          label="Answers in Queue"
          value={pendingCount}
          trend="Needs teacher approval"
          tone="brand"
        />
        <MetricCard
          icon="👥"
          label="Students Waiting"
          value={uniqueStudents}
          trend="Unique learners"
          tone="mint"
        />
        <MetricCard
          icon="⏱"
          label="Avg. Answer Length"
          value={`${avgAnswerSize} ch`}
          trend="Helps estimate review time"
          tone="violet"
        />
      </section>

      <GlassPanel className="p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Review Queue
          </h2>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
            Sorted by latest submissions
          </p>
        </div>

        {pending?.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300/60 bg-white/45 px-6 py-14 text-center dark:border-slate-500/35 dark:bg-slate-900/25">
            <div className="space-y-2">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-xl dark:bg-emerald-300/20">
                ✅
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                All clear, no pending reviews.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Your grading queue is fully up to date.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {pending?.map((answer, index) => (
            <InteractiveTilt
              key={answer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              whileHover={{ y: -4 }}
              className="control-module p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                  <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-900 dark:bg-amber-300/20 dark:text-amber-100">
                    Pending
                  </span>
                  <span>{answer.student_username}</span>
                </div>
                <Link
                  to={`/teacher/review/${answer.id}`}
                  className="btn-premium px-4 py-2 text-xs"
                >
                  Open Review
                </Link>
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {answer.question_title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {answer.answer_text?.slice(0, 180)}
                {answer.answer_text?.length > 180 ? "..." : ""}
              </p>
            </InteractiveTilt>
          ))}
        </div>
      </GlassPanel>
    </PageTransition>
  );
}
