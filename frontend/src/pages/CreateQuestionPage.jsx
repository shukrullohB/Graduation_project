import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { createQuestion } from "../api/questions.api";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../api/http";
import PageTransition from "../components/ui/PageTransition";
import GlassPanel from "../components/ui/GlassPanel";
import InteractiveTilt from "../components/ui/InteractiveTilt";

const templates = [
  {
    id: "concept",
    label: "Concept",
    eyebrow: "Explain",
    title: "Explain Core Concept",
    description:
      "Define the concept and explain how it works with one practical example.",
    reference_answer:
      "A strong answer should include definition, key mechanism, and a relevant example with correct terminology.",
  },
  {
    id: "compare",
    label: "Compare",
    eyebrow: "Contrast",
    title: "Compare Two Approaches",
    description:
      "Compare approach A and B, highlighting differences in structure, performance, and use-cases.",
    reference_answer:
      "Ideal answer contrasts both approaches with at least three clear comparison points and a justified conclusion.",
  },
  {
    id: "scenario",
    label: "Scenario",
    eyebrow: "Apply",
    title: "Scenario-Based Question",
    description:
      "Given the scenario, explain the best solution and justify your reasoning step by step.",
    reference_answer:
      "Expected answer identifies the core problem, proposes a valid solution, and supports it with logical justification.",
  },
];

export default function CreateQuestionPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    reference_answer: "",
    max_score: 5,
  });
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { showToast } = useToast();

  const applyTemplate = (template) => {
    setActiveTemplate(template.id);
    setForm((prev) => ({
      ...prev,
      title: template.title,
      description: template.description,
      reference_answer: template.reference_answer,
    }));
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

  const promptLength = form.description.trim().length;
  const referenceLength = form.reference_answer.trim().length;

  return (
    <PageTransition className="space-y-6">
      <GlassPanel className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),linear-gradient(145deg,rgba(0,71,255,0.96),rgba(26,88,255,0.92))]" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/78">
              Teacher Tools
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#FFF8E7] md:text-4xl">
              Smart Question Builder
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 md:text-base">
              Create prompts that are easy for students to read, easy for the AI to score, and easy for you to review later.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate("/teacher")}
            >
              Back to Dashboard
            </button>
            <div className="rounded-[24px] border border-white/18 bg-white/14 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/72">
                Suggested depth
              </p>
              <p className="mt-1 text-sm font-semibold text-[#FFF8E7]">
                3 key ideas + 1 concrete example
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>

      <InteractiveTilt maxTilt={4}>
        <GlassPanel className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#0047FF]/16 bg-[#0047FF]/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#0047FF]">
              Best practice
            </span>
            <p className="text-sm leading-7 text-[#556581]">
              Keep the prompt specific, define the success criteria, and make the reference answer concise enough to guide scoring consistently.
            </p>
          </div>
        </GlassPanel>
      </InteractiveTilt>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel className="p-5 md:p-6">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
              Quick templates
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#16305F]">
              Start from a better structure
            </h2>
          </div>

          <div className="grid gap-3">
            {templates.map((template) => {
              const isActive = activeTemplate === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className={
                    isActive
                      ? "rounded-[24px] border border-[#0047FF]/24 bg-[linear-gradient(135deg,rgba(0,71,255,0.10),rgba(255,248,231,0.92))] p-4 text-left shadow-[0_16px_32px_rgba(0,71,255,0.12)]"
                      : "rounded-[24px] border border-[#0047FF]/10 bg-white/78 p-4 text-left transition duration-150 hover:border-[#0047FF]/18 hover:bg-white"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                        {template.eyebrow}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-[#16305F]">
                        {template.label} Template
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#0047FF]/12 px-3 py-1 text-xs text-[#6F7F9D]">
                      Use
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#556581]">
                    {template.description}
                  </p>
                </button>
              );
            })}
          </div>
        </GlassPanel>

        <InteractiveTilt maxTilt={5}>
          <GlassPanel className="p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#0047FF]/72">
                  Authoring surface
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#16305F]">
                  Compose a cleaner prompt
                </h2>
              </div>

              <div className="grid gap-2 rounded-[24px] border border-[#0047FF]/12 bg-[#FFF8E7] px-4 py-3 text-xs text-[#556581]">
                <div className="flex items-center justify-between gap-4">
                  <span>Prompt chars</span>
                  <strong className="font-semibold text-[#16305F]">{promptLength}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Reference chars</span>
                  <strong className="font-semibold text-[#16305F]">{referenceLength}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[1fr_190px]">
                <label className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0047FF]/74">
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
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0047FF]/74">
                    Max score
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
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0047FF]/74">
                  Question description
                </span>
                <textarea
                  className="control-textarea min-h-[150px] w-full"
                  rows={5}
                  placeholder="Write the full question shown to students..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0047FF]/74">
                  Reference answer
                </span>
                <textarea
                  className="control-textarea min-h-[180px] w-full"
                  rows={6}
                  placeholder="Define the ideal answer the model should compare against..."
                  value={form.reference_answer}
                  onChange={(e) =>
                    setForm({ ...form, reference_answer: e.target.value })
                  }
                  required
                />
              </label>

              <div className="rounded-[24px] border border-[#0047FF]/12 bg-[#FFF8E7] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#556581]">
                  <span>Balanced prompts usually combine scope, expected reasoning, and one clear output format.</span>
                  <span className="rounded-full border border-[#0047FF]/16 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0047FF]/72">
                    AI-ready rubric
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn-animated-secondary"
                  onClick={() => navigate("/teacher")}
                  aria-label="Cancel and go back"
                >
                  <svg
                    className="arr-1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 12H17M17 12L13 8M17 12L13 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text">Cancel</span>
                  <span className="circle" aria-hidden="true" />
                  <svg
                    className="arr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 12H17M17 12L13 8M17 12L13 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="btn-animated-primary min-w-[220px]"
                  disabled={loading}
                >
                  <svg
                    className="arr-1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 12H17M17 12L13 8M17 12L13 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text">
                    {loading ? "Creating..." : "Create Question"}
                  </span>
                  <span className="circle" aria-hidden="true" />
                  <svg
                    className="arr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 12H17M17 12L13 8M17 12L13 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </form>
          </GlassPanel>
        </InteractiveTilt>
      </section>
    </PageTransition>
  );
}
