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
      qc.invalidateQueries({ queryKey: ["pending-answers"] });
      navigate("/teacher");
    } catch (err) {
      setError(err.response?.data?.detail || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading review workspace..." />;
  }

  const answerLength = answer?.answer_text?.trim().length ?? 0;
  const aiRaw = Number(answer?.ai_score ?? 0);
  const aiPercent = Math.max(
    0,
    Math.min(100, aiRaw <= 1 ? aiRaw * 100 : aiRaw),
  );
  const aiTone = aiPercent >= 75 ? "high" : aiPercent >= 45 ? "mid" : "low";

  return (
    <PageTransition className="space-y-5">
      <GlassPanel className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,214,76,0.12),transparent_30%)]" />

        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0047FF]">
              Review Session
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#16305F] md:text-4xl">
              Teacher Validation Workspace
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5A6B88] md:text-base">
              Review the student response, compare it with the AI suggestion,
              and publish a clear final score with actionable feedback.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#6F7F9D]">
              <span className="rounded-full border border-[#0047FF]/12 bg-white/80 px-4 py-2">
                Student:{" "}
                <strong className="font-semibold text-[#16305F]">
                  {answer?.student_username}
                </strong>
              </span>
              <span className="rounded-full border border-[#0047FF]/12 bg-[#FFF8E7] px-4 py-2">
                Submission #{answer?.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#0047FF]/12 bg-[#EAF2FF] px-4 py-2 text-sm font-semibold text-[#0047FF]">
              Pending Review
            </span>
            <button
              onClick={() => navigate("/teacher")}
              type="button"
              className="rounded-2xl border border-[#0047FF]/18 bg-white/85 px-5 py-3 text-sm font-semibold text-[#0047FF] transition duration-200 hover:bg-[#F5F8FF]"
            >
              Back
            </button>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-4 lg:grid-cols-2">
        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.07),transparent_38%)]" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0047FF]">
                Question
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#16305F]">
                {answer?.question_title}
              </h3>
              {answer?.question_description ? (
                <p className="mt-4 text-sm leading-7 text-[#5A6B88] md:text-base">
                  {answer.question_description}
                </p>
              ) : null}
            </div>
          </GlassPanel>
        </InteractiveTilt>

        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,71,255,0.07),transparent_38%)]" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0047FF]">
                  Student Answer
                </p>
                <span className="rounded-full border border-[#0047FF]/10 bg-white/75 px-3 py-1 text-xs text-[#6F7F9D]">
                  {answerLength} chars
                </span>
              </div>

              <div className="mt-4 rounded-[26px] border border-[#0047FF]/10 bg-[linear-gradient(180deg,#ffffff,#fbfdff)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <p className="text-sm leading-8 text-[#4E6183] md:text-[15px]">
                  {answer?.answer_text}
                </p>
              </div>
            </div>
          </GlassPanel>
        </InteractiveTilt>
      </section>

      {answer?.ai_score != null ? (
        <GlassPanel className="relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.08),transparent_34%)]" />
          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0047FF]">
                AI Suggestion
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold tracking-tight text-[#16305F]">
                  Suggested Score
                </h3>
                <ScoreBadge score={answer.ai_score} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#5A6B88] md:text-base">
                {answer.ai_feedback || "No AI feedback available."}
              </p>
            </div>

            <div className="w-full max-w-[360px] rounded-[28px] border border-[#0047FF]/12 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 shadow-[0_18px_36px_rgba(22,48,95,0.08)]">
              <div className="mb-3 flex items-center justify-between text-sm text-[#6F7F9D]">
                <span>Confidence Trend</span>
                <strong className="font-semibold text-[#16305F]">
                  {aiPercent.toFixed(0)}%
                </strong>
              </div>

              <div className="h-[10px] overflow-hidden rounded-full bg-[#E7EEFB]">
                <motion.span
                  className={`block h-full ${
                    aiTone === "high"
                      ? "bg-[linear-gradient(90deg,#0047FF,#2A6BFF)]"
                      : aiTone === "mid"
                        ? "bg-[linear-gradient(90deg,#2A6BFF,#6E98FF)]"
                        : "bg-[linear-gradient(90deg,#8AB0FF,#C4D7FF)]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${aiPercent}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>
        </GlassPanel>
      ) : null}

      <GlassPanel className="relative overflow-hidden p-6 md:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,71,255,0.07),transparent_34%)]" />
        <div className="relative">
          <h3 className="text-2xl font-semibold tracking-tight text-[#16305F]">
            Final Teacher Review
          </h3>
          <p className="mt-2 text-sm leading-7 text-[#5A6B88] md:text-base">
            Provide a fair final score and constructive feedback.
          </p>

          {error ? (
            <div className="mt-4 rounded-[20px] border border-[#C92A2A]/18 bg-[#FFF1F1] px-4 py-3 text-sm text-[#A12828]">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="rounded-[28px] border border-[#0047FF]/12 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 shadow-[0_18px_36px_rgba(22,48,95,0.08)]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0047FF]">
                  Score (0-100)
                </label>
                <p className="mt-3 text-sm leading-6 text-[#6F7F9D]">
                  Set the final teacher-approved score for this submission.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <input
                    className="h-[64px] w-[130px] rounded-[22px] border border-[#D5E1F5] bg-white px-4 text-center text-3xl font-semibold tracking-tight text-[#16305F] outline-none transition duration-200 focus:border-[#0047FF] focus:ring-4 focus:ring-[#0047FF]/10"
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                  />
                  <div className="min-w-[96px] rounded-[22px] border border-[#0047FF]/10 bg-[#F5F8FF] px-3 py-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6F7F9D]">
                      Preview
                    </p>
                    <div className="mt-2 flex justify-center">
                      {score !== "" ? (
                        <ScoreBadge score={Number(score)} />
                      ) : (
                        <span className="text-sm font-medium text-[#9AA8BF]">
                          --
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E7EEFB] accent-[#0047FF]"
                  type="range"
                  min={0}
                  max={100}
                  value={score === "" ? 0 : Number(score)}
                  onChange={(e) => setScore(e.target.value)}
                />

                <div className="mt-3 flex justify-between text-xs text-[#8A97AE]">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#0047FF]/12 bg-[linear-gradient(180deg,#ffffff,#fbfdff)] p-5 shadow-[0_18px_36px_rgba(22,48,95,0.08)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0047FF]">
                      Feedback
                    </label>
                    <p className="mt-2 text-sm leading-6 text-[#6F7F9D]">
                      Explain strengths, gaps, and what the student should
                      improve next.
                    </p>
                  </div>
                  <span className="rounded-full border border-[#0047FF]/10 bg-white px-3 py-1 text-xs text-[#7B8BA7]">
                    {feedback.trim().length} chars
                  </span>
                </div>

                <textarea
                  className="mt-4 min-h-[220px] w-full rounded-[24px] border border-[#D5E1F5] bg-white px-5 py-4 text-[15px] leading-8 text-[#16305F] outline-none transition duration-200 placeholder:text-[#97A4BC] focus:border-[#0047FF] focus:ring-4 focus:ring-[#0047FF]/10"
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write constructive feedback for the student..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#0047FF]/10 bg-[#F8FBFF] px-4 py-4">
              <div className="text-sm text-[#6F7F9D]">
                Final check: make sure the score matches the written feedback.
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-[#0047FF]/18 bg-white/88 px-5 py-3 text-sm font-semibold text-[#55709B] transition duration-200 hover:bg-[#F5F8FF]"
                onClick={() => navigate("/teacher")}
              >
                Cancel
              </button>
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0047FF,#2A6BFF)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(0,71,255,0.28)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_22px_40px_rgba(0,71,255,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </GlassPanel>
    </PageTransition>
  );
}
