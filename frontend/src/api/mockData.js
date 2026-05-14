// Mock data for testing the frontend without a running backend.
// To enable: set VITE_DEMO_MODE=true in .env

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const mockUser = {
  id: 1,
  username: "demo_student",
  email: "student@demo.com",
  role: "student",
};

export const mockTeacher = {
  id: 2,
  username: "demo_teacher",
  email: "teacher@demo.com",
  role: "teacher",
};

export const mockQuestions = [
  {
    id: 1,
    title: "What is Machine Learning?",
    description:
      "Explain what machine learning is and describe at least two types of machine learning algorithms.",
    reference_answer:
      "Machine learning is a subset of AI that allows systems to learn from data...",
    max_score: 5,
  },
  {
    id: 2,
    title: "Explain NLP",
    description:
      "What is Natural Language Processing? Give two real-world applications.",
    reference_answer:
      "NLP is a branch of AI concerned with enabling computers to understand human language...",
    max_score: 5,
  },
  {
    id: 3,
    title: "Neural Networks",
    description:
      "Describe the basic structure of a neural network and explain how backpropagation works.",
    reference_answer:
      "A neural network consists of an input layer, one or more hidden layers, and an output layer...",
    max_score: 5,
  },
];

export const mockAnswers = [
  {
    id: 1,
    question_id: 1,
    question_title: "What is Machine Learning?",
    answer_text:
      "Machine learning is a method of data analysis that automates analytical model building.",
    score: 80,
    ai_score: 75,
    feedback:
      "Good explanation. Could elaborate more on supervised vs unsupervised learning.",
    student_username: "demo_student",
  },
  {
    id: 2,
    question_id: 2,
    question_title: "Explain NLP",
    answer_text: "NLP helps computers understand human text.",
    score: null,
    ai_score: 45,
    feedback: null,
    student_username: "demo_student",
  },
];

export const mockPendingAnswers = [
  {
    id: 3,
    question_id: 1,
    question_title: "What is Machine Learning?",
    question_description:
      "Explain what machine learning is and describe at least two types of machine learning algorithms.",
    answer_text:
      "Machine learning is when computers learn patterns from data automatically without being explicitly programmed.",
    ai_score: 72,
    ai_feedback:
      "The answer captures the core concept but misses the distinction between ML types.",
    student_username: "test_student",
  },
];

export const mockAnalyticsStudent = {
  avgScores: [
    { subject: "ML", avgScore: 80 },
    { subject: "NLP", avgScore: 45 },
    { subject: "Neural Nets", avgScore: 70 },
  ],
  mistakes: [
    { subject: "ML", mistakes: 1 },
    { subject: "NLP", mistakes: 3 },
    { subject: "Neural Nets", mistakes: 2 },
  ],
  distribution: [
    { range: "80-100", count: 1 },
    { range: "50-79", count: 1 },
    { range: "0-49", count: 1 },
  ],
};

export const mockAnalyticsTeacher = {
  avgScores: [
    { subject: "ML", avgScore: 73 },
    { subject: "NLP", avgScore: 61 },
    { subject: "Neural Nets", avgScore: 68 },
  ],
  mistakes: [
    { subject: "ML", mistakes: 5 },
    { subject: "NLP", mistakes: 9 },
    { subject: "Neural Nets", mistakes: 7 },
  ],
  distribution: [
    { range: "80-100", count: 8 },
    { range: "50-79", count: 14 },
    { range: "0-49", count: 6 },
  ],
};
