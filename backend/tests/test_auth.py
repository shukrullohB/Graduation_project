from fastapi.testclient import TestClient


def test_register_login_me_flow(client: TestClient) -> None:
	register_payload = {
		"full_name": "Teacher One",
		"email": "teacher1@example.com",
		"password": "123456",
		"role": "teacher",
	}
	register_response = client.post("/api/v1/auth/register", json=register_payload)
	assert register_response.status_code == 201
	assert register_response.json()["email"] == "teacher1@example.com"

	login_response = client.post(
		"/api/v1/auth/login",
		data={"username": "teacher1@example.com", "password": "123456"},
	)
	assert login_response.status_code == 200
	access_token = login_response.json()["access_token"]
	assert access_token

	me_response = client.get(
		"/api/v1/auth/me",
		headers={"Authorization": f"Bearer {access_token}"},
	)
	assert me_response.status_code == 200
	assert me_response.json()["role"] == "teacher"


def test_register_duplicate_email_returns_409(client: TestClient) -> None:
	payload = {
		"full_name": "Teacher One",
		"email": "teacher1@example.com",
		"password": "123456",
		"role": "teacher",
	}
	first = client.post("/api/v1/auth/register", json=payload)
	assert first.status_code == 201

	second = client.post("/api/v1/auth/register", json=payload)
	assert second.status_code == 409
	assert second.json()["detail"] == "Email already registered"
