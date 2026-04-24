import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createQuestion } from "../api/questions.api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../api/http";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import InteractiveTilt from "../components/ui/InteractiveTilt";

export default function CreateQuestionPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    reference_answer: "",
    max_score: 5,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { showToast } = useToast();

  const applyTemplate = (type) => {
    if (type === "concept") {
      setForm({
        ...form,
        title: "Explain Core Concept",
        description:
          "Define the concept and explain how it works with one practical example.",
        reference_answer:
          "A strong answer should include definition, key mechanism, and a relevant example with correct terminology.",
      });
      return;
    }

    if (type === "compare") {
      setForm({
        ...form,
        title: "Compare Two Approaches",
        description:
          "Compare approach A and B, highlighting differences in structure, performance, and use-cases.",
        reference_answer:
          "Ideal answer contrasts both approaches with at least three clear comparison points and a justified conclusion.",
      });
      return;
    }

    setForm({
      ...form,
      title: "Scenario-Based Question",
      description:
        "Given the scenario, explain the best solution and justify your reasoning step by step.",
      reference_answer:
        "Expected answer identifies the core problem, proposes a valid solution, and supports it with logical justification.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.reference_answer.trim()
    ) {
      showToast("All fields are required", "error");
      return;
    }
    setLoading(true);
    try {
      await createQuestion(form);
      qc.invalidateQueries({ queryKey: ["questions"] });
      showToast("Question created successfully!", "success");
      navigate("/teacher");
    } catch (err) {
      showToast(getApiErrorMessage(err, "Failed to create question"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="space-y-4">
      <GlassPanel className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              Teacher Tools
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
              Smart Question Builder
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Design clear prompts and high-quality reference answers so AI
              scoring stays consistent and explainable.
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => navigate("/teacher")}
          >
            Back to Dashboard
          </button>
        </div>
      </GlassPanel>

      <InteractiveTilt maxTilt={4}>
        <GlassPanel className="p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <strong>Best practice:</strong> Keep the prompt specific and provide a
          concise reference answer with key concepts you expect from students.
        </GlassPanel>
      </InteractiveTilt>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-ghost status-chip"
          onClick={() => applyTemplate("concept")}
        >
          Concept Template
        </button>
        <button
          type="button"
          className="btn-ghost status-chip"
          onClick={() => applyTemplate("compare")}
        >
          Compare Template
        </button>
        <button
          type="button"
          className="btn-ghost status-chip"
          onClick={() => applyTemplate("scenario")}
        >
          Scenario Template
        </button>
      </div>

      <InteractiveTilt maxTilt={5}>
        <GlassPanel className="p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_180px]">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Title
                </span>
                <input
                  className="control-input w-full"
                  type="text"
                  placeholder="Short title for the question"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Max Score
                </span>
                <input
                  className="control-input w-full text-center font-semibold"
                  type="number"
                  min={1}
                  max={10}
                  value={form.max_score}
                  onChange={(e) =>
                    setForm({ ...form, max_score: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Question Description
              </span>
              <textarea
                className="control-textarea min-h-[120px] w-full"
                rows={4}
                placeholder="Full question text shown to students..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Reference Answer (AI baseline)
              </span>
              <textarea
                className="control-textarea min-h-[150px] w-full"
                rows={5}
                placeholder="Model/ideal answer for this question..."
                value={form.reference_answer}
                onChange={(e) =>
                  setForm({ ...form, reference_answer: e.target.value })
                }
                required
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/70 bg-white/55 px-3 py-2 text-xs text-slate-500 dark:border-slate-600/35 dark:bg-slate-900/25 dark:text-slate-300">
              <span>Prompt chars: {form.description.trim().length}</span>
              <span>
                Reference chars: {form.reference_answer.trim().length}
              </span>
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
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Question"}
              </motion.button>
            </div>
          </form>
        </GlassPanel>
      </InteractiveTilt>
    </PageTransition>
  );
}
