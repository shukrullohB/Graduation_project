from fastapi.testclient import TestClient


def _register(client: TestClient, payload: dict) -> None:
	response = client.post("/api/v1/auth/register", json=payload)
	assert response.status_code == 201


def _login(client: TestClient, email: str, password: str) -> str:
	response = client.post(
		"/api/v1/auth/login",
		data={"username": email, "password": password},
	)
	assert response.status_code == 200
	return response.json()["access_token"]


def test_questions_answers_reviews_and_analytics_flow(client: TestClient) -> None:
	_register(
		client,
		{
			"full_name": "Teacher One",
			"email": "teacher1@example.com",
			"password": "123456",
			"role": "teacher",
		},
	)
	_register(
		client,
		{
			"full_name": "Student One",
			"email": "student1@example.com",
			"password": "123456",
			"role": "student",
		},
	)

	teacher_token = _login(client, "teacher1@example.com", "123456")
	student_token = _login(client, "student1@example.com", "123456")
	teacher_headers = {"Authorization": f"Bearer {teacher_token}"}
	student_headers = {"Authorization": f"Bearer {student_token}"}

	create_question_response = client.post(
		"/api/v1/questions",
		headers=teacher_headers,
		json={
			"title": "Photosynthesis",
			"prompt": "Explain photosynthesis briefly.",
			"reference_answer": "Plants make glucose and oxygen from sunlight, water and CO2.",
			"max_score": 5,
		},
	)
	assert create_question_response.status_code == 201
	question_id = create_question_response.json()["id"]

	list_questions_response = client.get("/api/v1/questions")
	assert list_questions_response.status_code == 200
	assert len(list_questions_response.json()) == 1

	get_question_response = client.get(f"/api/v1/questions/{question_id}")
	assert get_question_response.status_code == 200

	submit_answer_response = client.post(
		"/api/v1/answers/submit",
		headers=student_headers,
		json={
			"question_id": question_id,
			"answer_text": "Plants use sunlight to produce food and release oxygen.",
		},
	)
	assert submit_answer_response.status_code == 201
	answer_id = submit_answer_response.json()["id"]
	assert submit_answer_response.json()["status"] == "submitted"

	my_answers_response = client.get("/api/v1/answers/my", headers=student_headers)
	assert my_answers_response.status_code == 200
	assert len(my_answers_response.json()) == 1

	question_answers_teacher = client.get(
		f"/api/v1/answers/question/{question_id}",
		headers=teacher_headers,
	)
	assert question_answers_teacher.status_code == 200
	assert len(question_answers_teacher.json()) == 1

	question_answers_student = client.get(
		f"/api/v1/answers/question/{question_id}",
		headers=student_headers,
	)
	assert question_answers_student.status_code == 403
	assert question_answers_student.json()["detail"] == "Teacher role required"

	pending_response = client.get("/api/v1/reviews/pending", headers=teacher_headers)
	assert pending_response.status_code == 200
	assert len(pending_response.json()) == 1

	invalid_review = client.post(
		f"/api/v1/reviews/{answer_id}",
		headers=teacher_headers,
		json={"teacher_score": 10, "teacher_feedback": "Too high"},
	)
	assert invalid_review.status_code == 422

	valid_review = client.post(
		f"/api/v1/reviews/{answer_id}",
		headers=teacher_headers,
		json={"teacher_score": 4, "teacher_feedback": "Good answer."},
	)
	assert valid_review.status_code == 200
	assert valid_review.json()["status"] == "reviewed"

	overview_response = client.get("/api/v1/analytics/overview", headers=teacher_headers)
	assert overview_response.status_code == 200
	overview = overview_response.json()
	assert overview["total_users"] == 2
	assert overview["total_questions"] == 1
	assert overview["total_answers"] == 1
	assert overview["total_reviewed_answers"] == 1

	question_analytics_response = client.get(
		f"/api/v1/analytics/questions/{question_id}",
		headers=teacher_headers,
	)
	assert question_analytics_response.status_code == 200
	qa = question_analytics_response.json()
	assert qa["question_id"] == question_id
	assert qa["total_answers"] == 1
	assert qa["reviewed_answers"] == 1
