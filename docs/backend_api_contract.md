# Backend API Contract (Frontend Integration)

## Base
- Base URL: `http://127.0.0.1:8010/api/v1`
- Auth header: `Authorization: Bearer <access_token>`

## Auth
### `POST /auth/register`
Request body:
```json
{
  "full_name": "string",
  "email": "string",
  "password": "string",
  "role": "teacher"
}
```
Notes:
- `role` is `teacher` or `student`.

### `POST /auth/login`
Content type: `application/x-www-form-urlencoded`

Form fields:
- `username`: user email
- `password`: user password

Response:
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### `POST /auth/login/json`
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### `GET /auth/me`
Auth required.

Response:
```json
{
  "full_name": "string",
  "email": "string",
  "role": "teacher",
  "id": 1,
  "is_active": true,
  "created_at": "2026-03-03T09:00:00+05:00"
}
```

## Questions
### `POST /questions`
Auth required: teacher.

Request body:
```json
{
  "title": "string",
  "prompt": "string",
  "reference_answer": "string",
  "max_score": 5
}
```

### `GET /questions`
Public endpoint.

### `GET /questions/{question_id}`
Public endpoint.

## Answers
### `POST /answers/submit`
Auth required: student.

Request body:
```json
{
  "question_id": 1,
  "answer_text": "string"
}
```

Response notes:
- If NLP service is available, `ai_score` and `ai_feedback` are filled.
- If NLP service is unavailable, endpoint still returns `201` and AI fields are `null`.

### `GET /answers/my`
Auth required: student.

### `GET /answers/question/{question_id}`
Auth required: teacher.

## Reviews
### `GET /reviews/pending`
Auth required: teacher.

Query params:
- `limit` (optional, default `50`, min `1`, max `200`)

### `POST /reviews/{answer_id}`
Auth required: teacher.

Request body:
```json
{
  "teacher_score": 4,
  "teacher_feedback": "Good structure and clear explanation."
}
```

Validation:
- `teacher_score >= 0`
- `teacher_score <= question.max_score`

## Analytics
### `GET /analytics/overview`
Auth required: teacher.

Response:
```json
{
  "total_users": 2,
  "total_teachers": 1,
  "total_students": 1,
  "total_questions": 1,
  "total_answers": 4,
  "total_reviewed_answers": 1,
  "review_coverage_percent": 25.0,
  "avg_ai_score": 4.0,
  "avg_teacher_score": 4.0
}
```

### `GET /analytics/questions/{question_id}`
Auth required: teacher.

Response:
```json
{
  "question_id": 1,
  "total_answers": 4,
  "reviewed_answers": 1,
  "review_coverage_percent": 25.0,
  "avg_ai_score": 4.0,
  "avg_teacher_score": 4.0
}
```

## Health
### `GET /health`
### `GET /api/v1/health`

Both return:
```json
{
  "status": "ok",
  "service": "backend"
}
```

## Frontend Notes
- Use `POST /auth/login` for Swagger-compatible/OAuth form login.
- If frontend prefers JSON login, use `POST /auth/login/json`.
- Teacher pages should use teacher token; student pages should use student token.
