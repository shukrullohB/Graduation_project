import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getAnswer } from "../api/answers.api";
import { submitReview } from "../api/review.api";
import ScoreBadge from "../components/ScoreBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import InteractiveTilt from "../components/ui/InteractiveTilt";

export default function TeacherReviewPage() {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: answer, isLoading } = useQuery({
    queryKey: ["answer", answerId],
    queryFn: () => getAnswer(answerId).then((r) => r.data),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitReview(answerId, { score: Number(score), feedback });
      qc.invalidateQueries({ queryKey: ["pendingAnswers"] });
      navigate("/teacher");
    } catch (err) {
      setError(err.response?.data?.detail || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading review workspace..." />;

  const answerLength = answer?.answer_text?.trim().length ?? 0;
  const aiRaw = Number(answer?.ai_score ?? 0);
  const aiPercent = Math.max(
    0,
    Math.min(100, aiRaw <= 1 ? aiRaw * 100 : aiRaw),
  );
  const aiTone = aiPercent >= 75 ? "high" : aiPercent >= 45 ? "mid" : "low";

  return (
    <PageTransition className="space-y-4">
      <GlassPanel className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              Review Session
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Teacher Validation Workspace
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Student: <strong>{answer?.student_username}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-300/20 dark:text-amber-100">
              Pending Review
            </span>
            <button
              className="btn-ghost"
              onClick={() => navigate("/teacher")}
              type="button"
            >
              ← Back
            </button>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-3 lg:grid-cols-2">
        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
              Question
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {answer?.question_title}
            </h3>
            {answer?.question_description && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {answer.question_description}
              </p>
            )}
          </GlassPanel>
        </InteractiveTilt>

        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Student Answer
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-300">
                #{answer?.id}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {answer?.answer_text}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
              <span className="rounded-full border border-slate-300/60 bg-white/45 px-2 py-1 dark:border-slate-500/35 dark:bg-slate-900/25">
                Length: {answerLength} chars
              </span>
            </div>
          </GlassPanel>
        </InteractiveTilt>
      </section>

      {answer?.ai_score != null && (
        <GlassPanel className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                AI Suggestion
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Suggested Score: <ScoreBadge score={answer.ai_score} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {answer.ai_feedback || "No AI feedback available."}
              </p>
            </div>

            <div className="w-full max-w-[320px] rounded-2xl border border-slate-300/40 bg-slate-900/40 p-3 dark:border-slate-600/35 dark:bg-slate-900/35">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                <span>Confidence Trend</span>
                <strong className="text-slate-800 dark:text-slate-100">
                  {aiPercent.toFixed(0)}%
                </strong>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <motion.span
                  className={`block h-full ${
                    aiTone === "high"
                      ? "bg-gradient-to-r from-emerald-500 to-lime-400"
                      : aiTone === "mid"
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-rose-500 to-red-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${aiPercent}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      <GlassPanel className="p-5">
        <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Final Teacher Review
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          Provide a fair final score and constructive feedback.
        </p>

        {error && (
          <p className="mt-3 rounded-xl border border-rose-300/60 bg-rose-100/70 px-3 py-2 text-sm text-rose-800 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
              Score (0-100)
            </label>
            <div className="flex items-center gap-3">
              <input
                className="control-input w-[120px] text-base font-semibold"
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
              {score !== "" && <ScoreBadge score={Number(score)} />}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
              Feedback
            </label>
            <textarea
              className="control-textarea min-h-[140px] w-full"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write constructive feedback for the student..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate("/teacher")}
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.985 }}
              type="submit"
              className="btn-premium"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </motion.button>
          </div>
        </form>
      </GlassPanel>
    </PageTransition>
  );
}
