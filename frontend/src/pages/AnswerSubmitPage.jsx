import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../api/questions.api";
import { submitAnswer } from "../api/answers.api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AnswerSubmitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: question, isLoading } = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id).then((r) => r.data),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await submitAnswer({ question_id: id, answer_text: answerText });
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <LoadingSpinner text="Loading question..." />
      </div>
    );
  }

  const currentLength = answerText.trim().length;
  const detailReady = currentLength >= 40;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-[#0047FF]/12 bg-[linear-gradient(135deg,#ffffff,rgba(255,248,231,0.96))] p-6 shadow-[0_24px_48px_rgba(18,48,95,0.08)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,71,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,214,76,0.16),transparent_28%)]" />

        <div className="relative space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#0047FF]/70">
                Student Submission
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#16305F] md:text-4xl">
                {question?.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5A6B88] md:text-base">
                Write a clear, structured answer. Focus on differences,
                reasoning, and concrete examples where useful.
              </p>
            </div>

            <div className="grid min-w-[220px] gap-3 rounded-[24px] border border-[#0047FF]/14 bg-white/82 p-4 shadow-[0_12px_30px_rgba(22,48,95,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.22em] text-[#6F7F9D]">
                  Question ID
                </span>
                <strong className="text-sm font-semibold text-[#16305F]">
                  #{question?.id}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.22em] text-[#6F7F9D]">
                  Max score
                </span>
                <strong className="text-sm font-semibold text-[#0047FF]">
                  {question?.max_score}
                </strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.22em] text-[#6F7F9D]">
                  Status
                </span>
                <strong
                  className={`text-sm font-semibold ${detailReady ? "text-[#0B8F55]" : "text-[#C28400]"}`}
                >
                  {detailReady ? "Ready to submit" : "Needs more detail"}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#0047FF]/16 bg-[linear-gradient(135deg,#0047FF,#2A6BFF)] p-6 text-white shadow-[0_22px_42px_rgba(0,71,255,0.24)] md:p-7">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78">
                Question Brief
              </span>
              <span className="text-sm text-white/58">
                Read carefully before you answer
              </span>
            </div>

            <p className="text-lg leading-8 text-white/92">
              {question?.description || question?.prompt}
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-[#0047FF]/12 bg-white/88 p-6 shadow-[0_24px_48px_rgba(18,48,95,0.08)] backdrop-blur-sm md:p-8"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#0047FF]/70">
              Your Answer
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#16305F]">
              Compose a strong response
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6F7F9D]">
              Keep it specific, readable, and directly tied to the question.
            </p>
          </div>

          <div className="rounded-full border border-[#0047FF]/12 bg-[#FFF8E7] px-4 py-2 text-sm font-medium text-[#5A6B88]">
            {detailReady ? "Good detail level" : "Aim for at least 40 characters"}
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-[20px] border border-[#C92A2A]/18 bg-[#FFF1F1] px-4 py-3 text-sm text-[#A12828]">
            {error}
          </div>
        ) : null}

        <div>
          <label
            htmlFor="student-answer"
            className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#16305F]"
          >
            Your Response
          </label>
          <textarea
            id="student-answer"
            rows={8}
            placeholder="Write your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
            className="min-h-[320px] w-full resize-y rounded-[28px] border border-[#D5E1F5] bg-[linear-gradient(180deg,#ffffff,#fbfdff)] px-5 py-4 text-base leading-8 text-[#16305F] shadow-[inset_0_1px_2px_rgba(22,48,95,0.04)] outline-none transition duration-200 placeholder:text-[#97A4BC] focus:border-[#0047FF] focus:ring-4 focus:ring-[#0047FF]/10"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#0047FF]/10 bg-[#F8FBFF] px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#5A6B88]">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-[#16305F] shadow-[0_8px_18px_rgba(22,48,95,0.05)]">
              Characters: {currentLength}
            </span>
            <span
              className={`font-medium ${detailReady ? "text-[#0B8F55]" : "text-[#C28400]"}`}
            >
              {detailReady ? "Good detail level" : "Try adding more detail"}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#0047FF,#2A6BFF)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(0,71,255,0.28)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_22px_40px_rgba(0,71,255,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      </form>
    </div>
  );
}
