import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getQuestions } from "../api/questions.api";
import { getMyAnswers } from "../api/answers.api";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import MetricCard from "../components/ui/MetricCard";
import InteractiveTilt from "../components/ui/InteractiveTilt";

export default function StudentDashboard() {
  const { data: questions, isLoading: qLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions().then((r) => r.data),
  });

  const { data: answers } = useQuery({
    queryKey: ["myAnswers"],
    queryFn: () => getMyAnswers().then((r) => r.data),
  });

  const answeredIds = new Set(answers?.map((a) => a.question_id));
  const totalQuestions = questions?.length ?? 0;
  const answeredCount = answeredIds.size;
  const remainingCount = Math.max(totalQuestions - answeredCount, 0);

  if (qLoading) return <LoadingSpinner text="Preparing your study board..." />;

  return (
    <PageTransition className="space-y-4">
      <InteractiveTilt maxTilt={4}>
        <GlassPanel className="p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                Student Analytics
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                Learning Flight Deck
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Keep momentum, finish pending answers, and build a stronger
                feedback trail with every submission.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-300/45 bg-emerald-100/70 px-4 py-2 text-sm font-medium text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
              {answeredCount}/{totalQuestions} completed
            </div>
          </div>
        </GlassPanel>
      </InteractiveTilt>

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          icon="📚"
          label="Total Questions"
          value={totalQuestions}
          trend="Open tasks in this module"
          tone="brand"
        />
        <MetricCard
          icon="✅"
          label="Submitted"
          value={answeredCount}
          trend="Already reviewed by system"
          tone="mint"
        />
        <MetricCard
          icon="🕒"
          label="Remaining"
          value={remainingCount}
          trend="Keep a steady pace"
          tone="violet"
        />
      </section>

      <InteractiveTilt maxTilt={3.5}>
        <GlassPanel className="p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Open Questions
            </h2>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
              Action queue
            </p>
          </div>

          {questions?.length === 0 && (
            <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300/60 bg-white/45 px-6 py-14 text-center dark:border-slate-500/35 dark:bg-slate-900/25">
              <div className="space-y-2">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-cyan-100 text-xl dark:bg-cyan-300/20">
                  📚
                </div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  No questions available yet.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Ask your teacher to publish the next assignment set.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {questions?.map((q, index) => (
              <InteractiveTilt
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                whileHover={{ y: -4 }}
                className="control-module p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {q.title}
                  </h3>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-300/20 dark:text-indigo-100">
                    Max: {q.max_score}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {(q.prompt || q.description || "").slice(0, 140)}
                  {(q.prompt || q.description || "").length > 140 ? "..." : ""}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-300">
                    {answeredIds.has(q.id)
                      ? "Already submitted"
                      : "Submission pending"}
                  </span>

                  {answeredIds.has(q.id) ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-300/20 dark:text-emerald-100">
                      Submitted
                    </span>
                  ) : (
                    <Link
                      to={`/student/submit/${q.id}`}
                      className="btn-premium px-4 py-2 text-xs"
                    >
                      Answer Now
                    </Link>
                  )}
                </div>
              </InteractiveTilt>
            ))}
          </div>
        </GlassPanel>
      </InteractiveTilt>
    </PageTransition>
  );
}
