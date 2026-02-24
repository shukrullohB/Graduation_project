# Graduation Project — Intelligent Short Answer Grading Platform (ASAG)

This project is an intelligent web-based platform for **automated assessment, feedback generation, and learning analytics** of short-answer student responses using **NLP** and a **teacher-guided AI (human-in-the-loop)** workflow.

The system helps teachers reduce grading time, improve scoring consistency, and provide faster and more useful feedback to students.

---

## 👥 Team Members & Responsibilities

- **Shukrullo Baxtiyorov (220411)** — Dataset preparation, NLP scoring model, training experiments, evaluation  
- **Sanjar Raximjanov (220304)** — Web platform backend, database, teacher review workflow, integration  
- **Akmaljon Polatjonov (220484)** — Feedback generation, learning analytics dashboards, usability testing & reporting  

---

## 🎯 Main Features (Planned)

### ✅ Automated Short Answer Grading (NLP)
- AI predicts rubric-based scores (0–5)
- Supports baseline models (TF-IDF / embeddings) and transformer-based models

### ✅ Feedback Generation
- Generates short and clear feedback for students
- Teachers can edit and improve feedback

### ✅ Human-in-the-loop Teacher Review
- Teacher reviews AI score + feedback
- Teacher can approve or correct results
- Corrections are stored for future model improvement

### ✅ Learning Analytics Dashboard
- Class performance summary
- Score distribution
- Common misconceptions and mistakes
- Student progress tracking

---

## 🧱 Project Structure
Graduation_project/
│
├── README.md
├── .gitignore
├── docker-compose.yml
├── .env.example
│
├── docs/
│   ├── TEAM_RULES.md
│   ├── API_SPEC.md
│   ├── DB_SCHEMA.md
│   ├── MODEL_EVALUATION.md
│   ├── DEPLOYMENT.md
│   └── REFERENCES.md
│
├── backend/
│   ├── README.md
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   │
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── question.py
│   │   │   ├── answer.py
│   │   │   ├── ai_result.py
│   │   │   └── review.py
│   │   │
│   │   ├── schemas/             # Pydantic schemas
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── question.py
│   │   │   ├── answer.py
│   │   │   ├── review.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── questions.py
│   │   │   │   ├── answers.py
│   │   │   │   ├── reviews.py
│   │   │   │   ├── analytics.py
│   │   │   │   └── health.py
│   │   │   └── router.py
│   │   │
│   │   ├── services/
│   │   │   ├── scoring_client.py     # calls nlp_service
│   │   │   ├── analytics_service.py
│   │   │   └── review_service.py
│   │   │
│   │   ├── crud/
│   │   │   ├── user_crud.py
│   │   │   ├── question_crud.py
│   │   │   ├── answer_crud.py
│   │   │   ├── review_crud.py
│   │   │   └── analytics_crud.py
│   │   │
│   │   └── utils/
│   │       ├── validators.py
│   │       └── helpers.py
│   │
│   └── tests/
│       ├── test_auth.py
│       └── test_questions.py
│
├── nlp_service/
│   ├── README.md
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   │
│   ├── app/
│   │   ├── main.py                 # FastAPI
│   │   ├── config.py
│   │   │
│   │   ├── scoring/
│   │   │   ├── baseline_tfidf.py
│   │   │   ├── sbert_scoring.py
│   │   │   ├── transformer_scoring.py
│   │   │   └── rubric_utils.py
│   │   │
│   │   ├── feedback/
│   │   │   ├── rule_based.py
│   │   │   ├── template_feedback.py
│   │   │   └── feedback_utils.py
│   │   │
│   │   ├── evaluation/
│   │   │   ├── metrics.py          # MAE, kappa, correlation
│   │   │   ├── evaluate_model.py
│   │   │   └── ablation.py
│   │   │
│   │   └── data/
│   │       ├── sample_dataset.csv
│   │       └── dataset_schema.json
│   │
│   └── tests/
│       ├── test_scoring.py
│       └── test_feedback.py
│
├── frontend/
│   ├── README.md
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   │
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   │
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   ├── authApi.js
│   │   │   ├── questionsApi.js
│   │   │   ├── answersApi.js
│   │   │   ├── reviewsApi.js
│   │   │   └── analyticsApi.js
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── QuestionPage.jsx
│   │   │   ├── AnswerSubmitPage.jsx
│   │   │   ├── TeacherReviewPage.jsx
│   │   │   └── AnalyticsDashboard.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ScoreBadge.jsx
│   │   │   ├── FeedbackBox.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── Charts/
│   │   │       ├── ScoreDistributionChart.jsx
│   │   │       ├── AverageScoreChart.jsx
│   │   │       └── MistakesChart.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   │
│   │   └── styles/
│   │       └── global.css
│   │
│   └── public/
│       └── favicon.svg
│
└── infra/
    ├── nginx/
    │   ├── nginx.conf
    │   └── default.conf
    │
    └── scripts/
        ├── deploy.sh
        └── backup_db.sh

---

## ⚙️ Tech Stack (Recommended)

### Backend
- Python + FastAPI
- PostgreSQL
- JWT Authentication

### Frontend
- React + Vite
- UI library (MUI or TailwindCSS)

### NLP / AI
- Hugging Face Transformers
- SBERT / embeddings
- Baselines: TF-IDF similarity

### Deployment
- Docker + Docker Compose
- Nginx + HTTPS (Let’s Encrypt)
- Ubuntu VPS

---

## 🚀 How We Work (GitHub Rules)

To keep the project stable and organized:

✅ **Main branch is protected**  
✅ All changes must be made through a **Pull Request (PR)**  
✅ Each task must be developed in a separate branch:

Examples:
- `feature/backend-auth`
- `feature/frontend-login`
- `feature/nlp-scoring`
- `fix/api-bug`

---

## 📌 Development Workflow

1. Pick an Issue (task)
2. Create a new branch
3. Implement the feature
4. Push the branch
5. Open a Pull Request to `main`
6. Team Lead reviews and merges

---

## 🏁 Project Timeline (Feb – May 2026)

- **February:** Dataset collection and preparation  
- **March:** NLP model development and training  
- **April:** Web platform implementation and integration  
- **Early May:** Final testing, evaluation, and reporting  

---

## 📊 Evaluation Metrics (Planned)

- Mean Absolute Error (MAE)
- Correlation with teacher scores
- Agreement measures (Cohen’s kappa / ICC)
- Grading time comparison (manual vs AI-assisted)

---

## 🔒 Ethics & Data Management

- Student answers will be anonymized
- Teacher consent will be obtained
- Data will be stored securely and used only for research purposes
- Teacher corrections will be stored as high-quality annotations for model improvement

---

## 📌 Status

🟡 Project started — initial structure and setup phase.

---

## 📄 License

This project is developed for academic purposes as part of the Graduation Project module.