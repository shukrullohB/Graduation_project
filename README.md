# 🎓 Intelligent Short Answer Grading Platform (ASAG)

An intelligent web-based platform for **automated short-answer assessment, feedback generation, and learning analytics** using NLP and a teacher-guided AI workflow (human-in-the-loop).

This project is developed as part of the Graduation Project module.

---

# 👥 Team

- **Shukrullo Baxtiyorov (220411)** — NLP model, dataset preparation, evaluation
- **Sanjar Raximjanov (220304)** — Backend, database, API, system integration
- **Akmaljon Polatjonov (220484)** — Frontend, analytics dashboards, usability testing

---

# 🎯 Project Goals

- Automatically score short-answer responses (rubric-based 0–5)
- Generate clear and useful feedback for students
- Allow teachers to review and correct AI outputs
- Store corrections to improve the model
- Provide learning analytics dashboards
- Reduce grading time and improve consistency

---

# 🏗️ Project Architecture

The system consists of 3 main services:

1. **Backend API (FastAPI)**
2. **NLP Service (AI scoring + feedback)**
3. **Frontend (React)**
4. **PostgreSQL Database**
5. **Dockerized infrastructure**

---

# 📁 Project Structure

```
Graduation_project/
│
├── backend/        # FastAPI backend (API, DB, auth, review workflow)
├── nlp_service/    # NLP scoring + feedback service
├── frontend/       # React frontend (teacher + student UI)
├── docs/           # Documentation and research materials
├── infra/          # Deployment configs (nginx, scripts)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 🔧 Backend (FastAPI)

Located in `backend/`

### Responsibilities:
- Authentication (JWT)
- User management (Teacher / Student)
- Question and answer management
- Teacher review workflow
- Analytics endpoints
- Communication with NLP service

### Main Components:

- `models/` → SQLAlchemy models
- `schemas/` → Pydantic validation schemas
- `api/routes/` → API endpoints
- `services/` → Business logic
- `crud/` → Database operations
- `core/` → Config, security, DB connection

---

# 🧠 NLP Service

Located in `nlp_service/`

### Responsibilities:
- Automatic scoring (0–5 rubric-based)
- Feedback generation
- Model evaluation
- Ablation studies

### Modules:

- `scoring/`
  - TF-IDF baseline
  - SBERT scoring
  - Transformer-based scoring

- `feedback/`
  - Rule-based feedback
  - Template feedback

- `evaluation/`
  - MAE
  - Cohen’s Kappa
  - Correlation
  - Ablation testing

- `data/`
  - Dataset schema
  - Sample dataset

---

# 💻 Frontend (React + Vite)

Located in `frontend/`

### Pages:

- LoginPage
- TeacherDashboard
- StudentDashboard
- QuestionPage
- AnswerSubmitPage
- TeacherReviewPage
- AnalyticsDashboard

### Components:

- Navbar
- ProtectedRoute
- ScoreBadge
- FeedbackBox
- Charts (ScoreDistribution, AverageScore, Mistakes)

---

# 🔄 System Workflow

```
Student Answer
      ↓
Backend
      ↓
NLP Service (score + feedback)
      ↓
Teacher Review (approve or correct)
      ↓
Final Grade Stored
      ↓
Analytics Dashboard
```

---

# 📊 Evaluation Metrics

- Mean Absolute Error (MAE)
- Correlation with teacher scores
- Cohen’s Kappa / ICC
- Grading time comparison
- Ablation study results

---

# 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### AI / NLP
- Hugging Face Transformers
- SBERT
- TF-IDF baseline

### Frontend
- React
- Vite
- Axios

### DevOps
- Docker
- Docker Compose
- Nginx
- Ubuntu VPS

---

# 🚀 How to Run (Development)

## 1️⃣ Clone repository

```bash
git clone <repo_url>
cd Graduation_project
```

---

## 2️⃣ Run with Docker

```bash
docker-compose up --build
```

---

## 3️⃣ Services

- Backend → http://localhost:8000
- NLP Service → http://localhost:8001
- Frontend → http://localhost:5173

---

## 4️⃣ Backend Local Commands

```bash
cd backend
../.venv/Scripts/python -m uvicorn app.main:app --reload --port 8010
```

```bash
cd backend
../.venv/Scripts/python -m alembic -c alembic.ini current
../.venv/Scripts/python -m alembic -c alembic.ini upgrade head
```

```bash
../.venv/Scripts/python -m pytest -q backend/tests
```

---

# 🔐 Git Workflow

We use a protected branching strategy:

- `main` → stable version
- `dev` → development integration
- `feature/*` → individual features

Workflow:

```
feature → dev → main
```

All changes must be made via Pull Request.

---

# 📚 Research Alignment

This project integrates:

- Automated Short Answer Grading (ASAG)
- Human-in-the-loop AI
- Feedback generation
- Learning analytics
- Teacher trust and usability evaluation

---

# 🔒 Ethics & Data Management

- Student data anonymized
- Teacher consent required
- Data stored securely
- Used strictly for academic purposes

---

# 📌 Current Status

🟡 In development phase — architecture and core services initialized.

---

# 📄 License

Academic project — for research and educational purposes only.
