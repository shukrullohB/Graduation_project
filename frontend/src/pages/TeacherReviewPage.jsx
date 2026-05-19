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
            <p
              style={{
                color: "#0047FF",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Review Session
            </p>
            <h2
              style={{
                marginTop: 8,
                color: "#FFF8E7",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Teacher Validation Workspace
            </h2>
            <p style={{ marginTop: 12, color: "rgba(255,248,231,0.5)" }}>
              Student:{" "}
              <strong style={{ color: "#FFF8E7" }}>
                {answer?.student_username}
              </strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                borderRadius: "20px",
                background: "rgba(0,71,255,0.12)",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                color: "#0047FF",
              }}
            >
              Pending Review
            </span>
            <button
              onClick={() => navigate("/teacher")}
              type="button"
              style={{
                border: "1px solid rgba(0,71,255,0.3)",
                color: "#0047FF",
                background: "transparent",
                borderRadius: 8,
                padding: "8px 12px",
                fontWeight: 700,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,71,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Back
            </button>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-3 lg:grid-cols-2">
        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="p-5">
            <p
              style={{
                color: "#0047FF",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Question
            </p>
            <h3
              style={{
                marginTop: 8,
                color: "#FFF8E7",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {answer?.question_title}
            </h3>
            {answer?.question_description && (
              <p style={{ marginTop: 12, color: "rgba(255,248,231,0.5)" }}>
                {answer.question_description}
              </p>
            )}
          </GlassPanel>
        </InteractiveTilt>

        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between">
              <p
                style={{
                  color: "#0047FF",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Student Answer
              </p>
              <span style={{ color: "rgba(255,248,231,0.5)", fontSize: 11 }}>
                #{answer?.id}
              </span>
            </div>

            <p style={{ marginTop: 12, color: "rgba(255,248,231,0.5)" }}>
              {answer?.answer_text}
            </p>

            <div
              className="mt-4 flex flex-wrap gap-2 text-xs"
              style={{ color: "rgba(255,248,231,0.5)" }}
            >
              <span className="rounded-full border border-slate-300/60 bg-white/45 px-2 py-1 dark:border-slate-500/35 dark:bg-slate-900/25">
                <span
                  style={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,248,231,0.1)",
                    background: "rgba(0,71,255,0.04)",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  Length: {answerLength} chars
                </span>
              </span>
            </div>
          </GlassPanel>
        </InteractiveTilt>
      </section>

      {answer?.ai_score != null && (
        <GlassPanel className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                style={{
                  color: "#0047FF",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                AI Suggestion
              </p>
              <h3
                style={{
                  marginTop: 8,
                  color: "#FFF8E7",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Suggested Score: <ScoreBadge score={answer.ai_score} />
              </h3>
              <p style={{ marginTop: 12, color: "rgba(255,248,231,0.5)" }}>
                {answer.ai_feedback || "No AI feedback available."}
              </p>
            </div>

            <div className="w-full max-w-[320px] rounded-2xl border border-slate-300/40 bg-slate-900/40 p-3 dark:border-slate-600/35 dark:bg-slate-900/35">
              <div
                className="mb-2 flex items-center justify-between text-xs"
                style={{ color: "rgba(255,248,231,0.5)" }}
              >
                <span>Confidence Trend</span>
                <strong style={{ color: "#FFF8E7" }}>
                  {aiPercent.toFixed(0)}%
                </strong>
              </div>

              <div
                style={{
                  height: "8px",
                  overflowX: "hidden",
                  borderRadius: "4px",
                  background: "rgba(255,248,231,0.1)",
                }}
              >
                <motion.span
                  className={`block h-full ${
                    aiTone === "high"
                      ? "bg-gradient-to-r from-blue-500 to-blue-400"
                      : aiTone === "mid"
                        ? "bg-gradient-to-r from-blue-400 to-blue-300"
                        : "bg-gradient-to-r from-blue-300 to-blue-200"
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
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#FFF8E7" }}>
          Final Teacher Review
        </h3>
        <p style={{ marginTop: 6, color: "rgba(255,248,231,0.5)" }}>
          Provide a fair final score and constructive feedback.
        </p>

        {error && (
            <p style={{
              marginTop: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(0,71,255,0.3)",
              background: "rgba(0,71,255,0.08)",
              padding: "12px",
              fontSize: "14px",
              color: "#FFF8E7"
            }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label
              style={{
                color: "#0047FF",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
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
            <label
              style={{
                color: "#0047FF",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
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
              {submitting ? "Submitting..." : "Submit Review"}
            </motion.button>
          </div>
        </form>
      </GlassPanel>
    </PageTransition>
  );
}



