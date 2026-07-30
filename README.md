# 🎓 Intelligent Short Answer Grading Platform (ASAG)

A web application for automatic short-answer grading using Natural Language Processing (NLP). The system helps teachers assess student answers, generate feedback, review AI predictions, and view learning analytics.

This project is being developed as our university graduation project.

---

## 👥 Team

- **Shukrullo Baxtiyorov** — NLP, dataset preparation, model evaluation
- **Sanjar Raximjanov** — Backend, database, API
- **Akmaljon Polatjonov** — Frontend, dashboards, UI testing

---

## Features

- Automatic grading of short answers (0–5)
- AI-generated feedback
- Teacher review and score correction
- Learning analytics dashboard
- Local storage of grading results
- Role-based access (Teacher / Student)

---

## Architecture

The project consists of four main parts:

- **Backend** – FastAPI
- **Frontend** – React + Vite
- **NLP Service** – automatic scoring and feedback
- **PostgreSQL** database

All services run with Docker.

---

## Project Structure

```
Graduation_project/
├── backend/
├── frontend/
├── nlp_service/
├── docs/
├── infra/
├── docker-compose.yml
└── README.md
```

---

## Backend

The backend provides:

- Authentication (JWT)
- User management
- Questions and answers
- Teacher review workflow
- Analytics API
- Communication with the NLP service

---

## NLP Service

The AI service is responsible for:

- Automatic answer scoring
- Feedback generation
- Model evaluation
- Comparing different scoring approaches

Current models include:

- TF-IDF
- SBERT
- Transformer-based models

---

## Frontend

The frontend includes pages for both teachers and students, including:

- Login
- Teacher Dashboard
- Student Dashboard
- Question Page
- Answer Submission
- Teacher Review
- Analytics Dashboard

---

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### Frontend
- React
- Vite
- Axios

### AI / NLP
- Hugging Face Transformers
- SBERT
- TF-IDF

### DevOps
- Docker
- Docker Compose
- Nginx

---

## Getting Started

Clone the repository:

```bash
git clone <repo_url>
cd Graduation_project
```

Run the project:

```bash
docker-compose up --build
```

Available services:

- Backend — http://localhost:8000
- NLP Service — http://localhost:8001
- Frontend — http://localhost:5173

---

## Development Workflow

```
feature → dev → main
```

All changes are merged through Pull Requests.

---

## Current Status

🚧 The project is currently under development.

---

## License

Academic project for educational and research purposes.
