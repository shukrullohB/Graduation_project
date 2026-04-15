import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion, suggestQuestionDraft } from "../api/questions.api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";

export default function CreateQuestionPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    reference_answer: "",
    max_score: 5,
  });
  const [assistant, setAssistant] = useState({
    topic: "",
    difficulty: "intermediate",
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { showToast } = useToast();

  const descriptionWordCount = form.description
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const referenceWordCount = form.reference_answer
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const isTitleValid = form.title.trim().length >= 8;
  const isDescriptionValid = form.description.trim().length >= 20;
  const isReferenceValid = form.reference_answer.trim().length >= 20;
  const isMaxScoreValid = form.max_score >= 1 && form.max_score <= 10;
  const completedChecks = [
    isTitleValid,
    isDescriptionValid,
    isReferenceValid,
    isMaxScoreValid,
  ].filter(Boolean).length;
  const completionPercent = Math.round((completedChecks / 4) * 100);

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
      showToast(
        err.response?.data?.detail || "Failed to create question",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!assistant.topic.trim()) {
      showToast("Please enter a topic for AI generation", "error");
      return;
    }

    setGenerating(true);
    try {
      const { data } = await suggestQuestionDraft({
        topic: assistant.topic,
        difficulty: assistant.difficulty,
        max_score: form.max_score,
        title_hint: form.title,
      });

      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.prompt || prev.description,
        reference_answer: data.reference_answer || prev.reference_answer,
        max_score: Number(data.max_score || prev.max_score),
      }));
      showToast("AI draft generated. You can edit before saving.", "success");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "AI assistant is temporarily unavailable",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page create-question-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Question</h1>
          <p className="page-subtitle">
            Build a clear assignment prompt and reference answer for AI scoring.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--secondary create-question-back"
          onClick={() => navigate("/teacher")}
        >
          ← Back
        </button>
      </div>

      <div className="create-question-layout">
        <div className="create-question-main">
          <div className="question-assistant-card">
            <div className="question-assistant-head">
              <h3>AI Assistant</h3>
              <span>Draft question in one click</span>
            </div>
            <div className="question-assistant-controls">
              <label className="form-group">
                <span className="form-label">Topic / Subject</span>
                <input
                  type="text"
                  placeholder="e.g. Neural Networks, SQL Joins, OOP"
                  value={assistant.topic}
                  onChange={(e) =>
                    setAssistant((prev) => ({ ...prev, topic: e.target.value }))
                  }
                />
              </label>
              <label className="form-group">
                <span className="form-label">Difficulty</span>
                <select
                  value={assistant.difficulty}
                  onChange={(e) =>
                    setAssistant((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <button
                type="button"
                className="btn question-assistant-generate"
                onClick={handleGenerateWithAI}
                disabled={generating}
              >
                {generating ? "Generating..." : "✨ Generate Draft"}
              </button>
            </div>
          </div>

          <div className="question-builder-tip">
            <strong>Best practice:</strong> Keep the prompt specific and provide
            a concise reference answer with key concepts you expect from
            students.
          </div>

          <form
            onSubmit={handleSubmit}
            className="question-builder-form modern-question-form"
          >
            <div className="question-form-section">
              <h3>Question Basics</h3>
              <div className="question-builder-grid">
                <label className="form-group">
                  <span className="form-label">Title</span>
                  <input
                    type="text"
                    placeholder="Short title for the question"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  <span className="create-question-meta">
                    Make it short and descriptive.
                  </span>
                </label>
                <label className="form-group question-builder-score">
                  <span className="form-label">Max Score</span>
                  <input
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
            </div>

            <div className="create-question-dual-panels">
              <div className="question-form-section">
                <h3>Student Prompt</h3>
                <label className="form-group">
                  <span className="form-label">Question Description</span>
                  <textarea
                    rows={5}
                    placeholder="Full question text shown to students..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                  <div className="create-question-field-footer">
                    <span className="create-question-meta">
                      Include task scope and expected output format.
                    </span>
                    <span className="create-question-counter">
                      {descriptionWordCount} words
                    </span>
                  </div>
                </label>
              </div>

              <div className="question-form-section">
                <h3>AI Evaluation Baseline</h3>
                <label className="form-group">
                  <span className="form-label">Reference Answer (AI baseline)</span>
                  <textarea
                    rows={5}
                    placeholder="Model/ideal answer for this question..."
                    value={form.reference_answer}
                    onChange={(e) =>
                      setForm({ ...form, reference_answer: e.target.value })
                    }
                    required
                  />
                  <div className="create-question-field-footer">
                    <span className="create-question-meta">
                      Add key points and terms used for scoring.
                    </span>
                    <span className="create-question-counter">
                      {referenceWordCount} words
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-actions create-question-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => navigate("/teacher")}
              >
                Cancel
              </button>
              <button type="submit" className="create-question-submit" disabled={loading}>
                {loading ? "Creating..." : "Create Question"}
              </button>
            </div>
          </form>
        </div>

        <aside className="create-question-sidebar" aria-label="Question quality checklist">
          <div className="create-question-progress">
            <div className="create-question-progress-head">
              <strong>Completion</strong>
              <span>{completionPercent}%</span>
            </div>
            <div className="create-question-progress-track">
              <span style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
          <h3>Quality Checklist</h3>
          <ul className="create-question-checklist">
            <li className={isTitleValid ? "is-done" : ""}>
              <span>{isTitleValid ? "✓" : "•"}</span>
              Clear title (at least 8 characters)
            </li>
            <li className={isDescriptionValid ? "is-done" : ""}>
              <span>{isDescriptionValid ? "✓" : "•"}</span>
              Student prompt is detailed and specific
            </li>
            <li className={isReferenceValid ? "is-done" : ""}>
              <span>{isReferenceValid ? "✓" : "•"}</span>
              Reference answer includes key expected points
            </li>
            <li className={isMaxScoreValid ? "is-done" : ""}>
              <span>{isMaxScoreValid ? "✓" : "•"}</span>
              Score range is valid (1 to 10)
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
