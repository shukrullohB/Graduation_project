import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../api/questions.api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";

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
          className="btn btn--secondary"
          onClick={() => navigate("/teacher")}
        >
          ← Back
        </button>
      </div>

      <div className="question-builder-tip">
        <strong>Best practice:</strong> Keep the prompt specific and provide a
        concise reference answer with key concepts you expect from students.
      </div>

      <form onSubmit={handleSubmit} className="question-builder-form modern-question-form">
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

        <div className="question-form-section">
          <h3>Student Prompt</h3>
          <label className="form-group">
            <span className="form-label">Question Description</span>
            <textarea
              rows={4}
              placeholder="Full question text shown to students..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
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
          </label>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate("/teacher")}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
